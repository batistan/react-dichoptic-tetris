import {
  Board,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  canPlaceBlock,
  clearLines,
  Coordinates, ghostBlockPosition,
  initBlockCoordinates,
  initialBoard, placeBlock
} from "./Board.ts";
import {Block, RandomBlockGenerator, rotateBlock, RotationDirection} from "./Blocks.ts";

export interface GameState {
  board: Board
  nextBlocks: Block[],
  currentBlockPosition: Coordinates,
  ghostBlockPosition: Coordinates,
  heldBlock: Block | null,
  score: number,
  linesCleared: number,
  canHold: boolean,
  isStarted: boolean,
  isOver: boolean
  isPaused: boolean,
}

export function initialGameState(): GameState {
  const initBlocks = RandomBlockGenerator.getInstance().getNextBlocks(6)
  const initBoard = initialBoard(BOARD_WIDTH, BOARD_HEIGHT)
  const initGhostCoords = ghostBlockPosition(initBlocks[0], initBoard, initBlockCoordinates)

  return {
    board: initBoard,
    // nextBlocks[0] is current block, remaining blocks shown in right panel
    nextBlocks: initBlocks,
    currentBlockPosition: initBlockCoordinates,
    ghostBlockPosition: initGhostCoords,
    heldBlock: null,
    canHold: true,
    linesCleared: 0,
    score: 0,
    isStarted: false,
    isOver: false,
    isPaused: false
  }
}

export enum GameStateAction {
  TICK = "TICK",
  PAUSE = "PAUSE",
  RESTART = "RESTART",
  MOVE_LEFT = "MOVE_LEFT",
  MOVE_RIGHT = "MOVE_RIGHT",
  MOVE_DOWN = "MOVE_DOWN",
  ROTATE_CLOCKWISE = "ROTATE_CLOCKWISE",
  ROTATE_ANTI_CLOCKWISE = "ROTATE_ANTI_CLOCKWISE",
  HARD_DROP = "HARD_DROP",
  HOLD = "HOLD"
}

export function getNextGameState(prevState: GameState, action: GameStateAction): GameState {
  const currentBlock = prevState.nextBlocks[0]
  switch (action) {
    case GameStateAction.PAUSE:
      return {...prevState, isPaused: !prevState.isPaused};
    case GameStateAction.RESTART:
      return initialGameState()
    case GameStateAction.MOVE_LEFT: {
      if (prevState.isOver || prevState.isPaused) { return prevState }
      const newPosition = {x: prevState.currentBlockPosition.x - 1, y: prevState.currentBlockPosition.y};
      if (canPlaceBlock(currentBlock, newPosition, prevState.board)) {
        const newGhostPosition = ghostBlockPosition(currentBlock, prevState.board, newPosition);
        return {...prevState, currentBlockPosition: newPosition, ghostBlockPosition: newGhostPosition};
      } else return prevState;
    }
    case GameStateAction.MOVE_RIGHT: {
      if (prevState.isOver || prevState.isPaused) { return prevState }
      const newPosition = {x: prevState.currentBlockPosition.x + 1, y: prevState.currentBlockPosition.y};
      if (canPlaceBlock(currentBlock, newPosition, prevState.board)) {
        const newGhostPosition = ghostBlockPosition(currentBlock, prevState.board, newPosition);
        return {...prevState, currentBlockPosition: newPosition, ghostBlockPosition: newGhostPosition};
      } else return prevState;
    }
    case GameStateAction.ROTATE_CLOCKWISE: {
      if (prevState.isOver || prevState.isPaused) { return prevState }
      const rotated = rotateBlock(currentBlock, RotationDirection.CLOCKWISE)
      if (canPlaceBlock(rotated, prevState.currentBlockPosition, prevState.board)) {
        const newGhostPosition = ghostBlockPosition(rotated, prevState.board, prevState.currentBlockPosition);
        return {...prevState, nextBlocks: [rotated, ...prevState.nextBlocks.slice(1)], ghostBlockPosition: newGhostPosition};
      } else return prevState;
    }
    case GameStateAction.ROTATE_ANTI_CLOCKWISE: {
      if (prevState.isOver || prevState.isPaused) { return prevState }
      const rotated = rotateBlock(currentBlock, RotationDirection.ANTI_CLOCKWISE)
      if (canPlaceBlock(rotated, prevState.currentBlockPosition, prevState.board)) {
        const newGhostPosition = ghostBlockPosition(rotated, prevState.board, prevState.currentBlockPosition);
        return {...prevState, nextBlocks: [rotated, ...prevState.nextBlocks.slice(1)], ghostBlockPosition: newGhostPosition};
      } else return prevState;
    }
    case GameStateAction.HOLD: {
      if (prevState.isOver || prevState.isPaused) { return prevState }
      if (!prevState.canHold) return prevState
      if (prevState.heldBlock == null) {
        return {
          ...prevState,
          nextBlocks: [...prevState.nextBlocks.slice(1), RandomBlockGenerator.getInstance().getNextBlock()],
          heldBlock: currentBlock,
          currentBlockPosition: initBlockCoordinates,
          ghostBlockPosition: ghostBlockPosition(prevState.nextBlocks[1], prevState.board, initBlockCoordinates),
          canHold: false
        }
      } else return {
        ...prevState,
        nextBlocks: [prevState.heldBlock, ...prevState.nextBlocks.slice(1)],
        heldBlock: currentBlock,
        currentBlockPosition: initBlockCoordinates,
        ghostBlockPosition: ghostBlockPosition(prevState.heldBlock, prevState.board, initBlockCoordinates),
        canHold: false
      }
    }
    case GameStateAction.HARD_DROP: {
      if (prevState.isOver || prevState.isPaused) { return prevState }

      return landBlock({
        ...prevState,
        currentBlockPosition: prevState.ghostBlockPosition,
        score: prevState.score + (prevState.ghostBlockPosition.y - prevState.currentBlockPosition.y)
      })
    }
    case GameStateAction.MOVE_DOWN:
    case GameStateAction.TICK: {
      const newPosition = { x: prevState.currentBlockPosition.x, y: prevState.currentBlockPosition.y + 1 }

      if (canPlaceBlock(currentBlock, newPosition, prevState.board)) {
        return {
          ...prevState,
          currentBlockPosition: newPosition,
          score: action === GameStateAction.MOVE_DOWN ? prevState.score + 1 : prevState.score
        }
      } else {
        return landBlock(prevState)
      }
    }
  }
}

function landBlock(
  prevState: GameState
): GameState {
  const currentBlock = prevState.nextBlocks[0]
  // land block
  const newBoard = placeBlock(currentBlock, prevState.currentBlockPosition, prevState.board)
  const { clearedBoard, rowIndicesCleared } = clearLines(newBoard)
  const scoreToAdd = (rowIndicesCleared.length > 0) ?
    calculateScore(rowIndicesCleared.length, prevState.linesCleared) : 0
  const nextBlock = prevState.nextBlocks[1]
  const gameIsOver = !canPlaceBlock(nextBlock, initBlockCoordinates, clearedBoard)

  return {
    ...prevState,
    canHold: true,
    nextBlocks: [...prevState.nextBlocks.slice(1), RandomBlockGenerator.getInstance().getNextBlock()],
    board: clearedBoard,
    score: prevState.score + scoreToAdd,
    linesCleared: prevState.linesCleared + rowIndicesCleared.length,
    currentBlockPosition: initBlockCoordinates,
    ghostBlockPosition: ghostBlockPosition(prevState.nextBlocks[1], clearedBoard, initBlockCoordinates),
    isOver: gameIsOver
  }
}

enum LineClearScoreBase {
  SINGLE = 40,
  DOUBLE = 100,
  TRIPLE = 300,
  TETRIS = 1200
}

export function calculateLevel(linesCleared: number): number {
  return Math.floor(linesCleared / 10) + 1;
}

function calculateScore(linesCleared: number, totalLinesCleared: number): number {
  const level = calculateLevel(totalLinesCleared);
  switch (linesCleared) {
    case 1: return LineClearScoreBase.SINGLE * (level + 1)
    case 2: return LineClearScoreBase.DOUBLE * (level + 1)
    case 3: return LineClearScoreBase.TRIPLE * (level + 1)
    case 4: return LineClearScoreBase.TETRIS * (level + 1)
    default: {
      console.error(`Invalid number of lines cleared ${linesCleared}`)
      return 0;
    }
  }
}
