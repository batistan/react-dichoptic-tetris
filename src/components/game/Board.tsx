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

export default function Board({ gameState, fallingColorHex, landedColorHex }: BoardProps) {
  const board = gameState.board;
  const fallingBlockPosition = gameState.currentBlockPosition;
  const currentBlockRotation = getRotationArray(gameState.nextBlocks[0]);

  return <div className="board w-64 rounded-l-md bg-board">
    { gameState.isPaused ?
      <p className="shadow">Paused</p>
      : board.rows.map((row, rowIndex) => {
      return <div key={row.id} className="flex flex-row">
        {row.cells.map((cell, colIndex) => {
          const isCurrentCellInBlock = rotationArrayValue(
            rowIndex,
            colIndex,
            fallingBlockPosition,
            currentBlockRotation
          ) === 1

          const color = isCurrentCellInBlock ? fallingColorHex : (cell === null ? "transparent" : landedColorHex)
          return <div key={`${row.id}-${colIndex}`} className="cell" style={{ backgroundColor: color }}/>
        })}
      </div>
    })}
  </div>
}
