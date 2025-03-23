import {GameState} from "./logic/GameState.ts";
import {getRotationArray, RotationArray} from "./logic/Blocks.ts";
import {Coordinates} from "./logic/Board.ts";

interface BoardProps {
  gameState: GameState,
  fallingColorHex: string,
  landedColorHex: string,
}

function rotationArrayValue(
  boardRowIndex: number,
  boardColIndex: number,
  blockCoords: Coordinates,
  rotationArray: RotationArray
): number | null {
  const rotationRow = boardRowIndex - blockCoords.y;
  if (rotationRow < 0 || rotationRow > rotationArray.length - 1) return null;

  const rotationCol = boardColIndex - blockCoords.x;
  if (rotationCol < 0 || rotationCol > rotationArray[0].length - 1) return null;

  return rotationArray[rotationRow][rotationCol];
}

function getCellColor(
  isFallingBlock: boolean,
  isLandedBlock: boolean,
  isGhostBlock: boolean,
  fallingColorHex: string,
  landedColorHex: string
): string {
  return isFallingBlock ? fallingColorHex : (
    isLandedBlock ? landedColorHex : (
      isGhostBlock ? "gray" : "transparent"
    )
  );
}

export default function Board({ gameState, fallingColorHex, landedColorHex }: BoardProps) {
  const board = gameState.board;
  const fallingBlockPosition = gameState.currentBlockPosition;
  const currentBlockRotation = getRotationArray(gameState.nextBlocks[0]);

  return <div className="w-64 h-fit rounded-md md:rounded-none md:rounded-bl-md overflow-hidden bg-board-bg">
    { gameState.isPaused ?
      <p className="shadow">Paused</p>
      : board.rows.map((row, rowIndex) => {
      return <div key={row.id} className="flex flex-row overflow-hidden">
        {row.cells.map((cell, colIndex) => {
          const isCurrentCellInBlock = rotationArrayValue(
            rowIndex,
            colIndex,
            fallingBlockPosition,
            currentBlockRotation
          ) === 1

          const isCurrentCellGhostBlock = rotationArrayValue(
            rowIndex,
            colIndex,
            gameState.ghostBlockPosition,
            currentBlockRotation
          ) === 1

          const isEmptyCell = cell === null

          const color = getCellColor(
            isCurrentCellInBlock,
            !isEmptyCell,
            isCurrentCellGhostBlock,
            fallingColorHex,
            landedColorHex
          )

          return <div key={`${row.id}-${colIndex}`} className="cell" style={{ backgroundColor: color }}/>
        })}
      </div>
    })}
  </div>
}
