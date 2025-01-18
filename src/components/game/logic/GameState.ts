import {
  Board,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  canPlaceBlock,
  clearLines,
  Coordinates,
  initBlockCoordinates,
  initialBoard
} from "./Board.ts";
import {Block, randomBlock, rotateBlock, RotationDirection} from "./Blocks.ts";

export interface GameState {
  board: Board
  nextBlocks: Block[],
  currentBlockPosition: Coordinates,
  heldBlock: Block | null,
  score: number,
  linesCleared: number,
  canHold: boolean,
  isStarted: true,
  isOver: boolean
  isPaused: boolean,
}

export function initialGameState(): GameState {
  return {
    board: initialBoard(BOARD_WIDTH, BOARD_HEIGHT),
    // nextBlocks[0] is current block, remaining blocks shown in right panel
    nextBlocks: [randomBlock(), randomBlock(), randomBlock(), randomBlock(), randomBlock(), randomBlock()],
    currentBlockPosition: initBlockCoordinates,
    heldBlock: null,
    canHold: true,
    linesCleared: 0,
    score: 0,
    isStarted: true,
    isOver: false,
    isPaused: false
  }
}

export type GameStateAction =
  "TICK" |
  "PAUSE" |
  "RESUME" |
  "MOVE_LEFT" |
  "MOVE_RIGHT" |
  "MOVE_DOWN" |
  "ROTATE_CLOCKWISE" |
  "ROTATE_ANTI_CLOCKWISE" |
  "HARD_DROP" |
  "HOLD"

export function getNextGameState(prevState: GameState, action: GameStateAction): GameState {
  const currentBlock = prevState.nextBlocks[0]
  switch (action) {
    case "PAUSE":
      return {...prevState, isPaused: true};
    case "RESUME":
      return {...prevState, isPaused: false};
    case "MOVE_LEFT": {
      const newPosition = {x: prevState.currentBlockPosition.x - 1, y: prevState.currentBlockPosition.y};
      if (canPlaceBlock(currentBlock, prevState.currentBlockPosition, prevState.board)) {
        return {...prevState, currentBlockPosition: newPosition};
      } else return prevState;
    }
    case "MOVE_RIGHT": {
      const newPosition = {x: prevState.currentBlockPosition.x + 1, y: prevState.currentBlockPosition.y};
      if (canPlaceBlock(currentBlock, prevState.currentBlockPosition, prevState.board)) {
        return {...prevState, currentBlockPosition: newPosition};
      } else return prevState;
    }
    case "ROTATE_CLOCKWISE": {
      const rotated = rotateBlock(currentBlock, RotationDirection.CLOCKWISE)
      if (canPlaceBlock(rotated, prevState.currentBlockPosition, prevState.board)) {
        return {...prevState, nextBlocks: [rotated, ...prevState.nextBlocks.slice(1)]};
      } else return prevState;
    }
    case "ROTATE_ANTI_CLOCKWISE": {
      const rotated = rotateBlock(currentBlock, RotationDirection.ANTI_CLOCKWISE)
      if (canPlaceBlock(rotated, prevState.currentBlockPosition, prevState.board)) {
        return {...prevState, nextBlocks: [rotated, ...prevState.nextBlocks.slice(1)]};
      } else return prevState;
    }
    case "HOLD": {
      if (!prevState.canHold) return prevState
      if (prevState.heldBlock == null) {
        return {
          ...prevState,
          nextBlocks: [...prevState.nextBlocks.slice(1), randomBlock()],
          heldBlock: currentBlock,
          canHold: false
        }
      } else return {
        ...prevState,
        nextBlocks: [...prevState.nextBlocks.slice(1), randomBlock()],
        canHold: false
      }
    }
    case "HARD_DROP":
      return prevState
    case "MOVE_DOWN":
    case "TICK": {
      const newPosition = { x: prevState.currentBlockPosition.x, y: prevState.currentBlockPosition.y + 1 }

      if (canPlaceBlock(currentBlock, newPosition, prevState.board)) {
        return {
          ...prevState,
          currentBlockPosition: newPosition
        }
      } else {
        // land block
        const { newBoard, rowIndicesCleared } = clearLines(prevState.board)
        let scoreToAdd = 0
        if (rowIndicesCleared.length > 0) {
          scoreToAdd += calculateScore(rowIndicesCleared.length, prevState.linesCleared)
        }
        const nextBlock = prevState.nextBlocks[1]
        const gameIsOver = !canPlaceBlock(nextBlock, initBlockCoordinates, newBoard)

        return {
          ...prevState,
          board: newBoard,
          score: prevState.score + scoreToAdd + ((action === "MOVE_DOWN") ? 1 : 0),
          linesCleared: prevState.linesCleared + rowIndicesCleared.length,
          currentBlockPosition: initBlockCoordinates,
          isOver: gameIsOver
        }
      }
    }
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
