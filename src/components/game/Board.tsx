import {GameState} from "./logic/GameState.ts";
import {getRotationArray, RotationArray} from "./logic/Blocks.ts";
import {Coordinates} from "./logic/Board.ts";
import {forwardRef} from "react";

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

const Board = forwardRef<HTMLDivElement, BoardProps>(({ gameState, fallingColorHex, landedColorHex }: BoardProps, ref) => {
  const board = gameState.board;
  const fallingBlockPosition = gameState.currentBlockPosition;
  const currentBlockRotation = getRotationArray(gameState.nextBlocks[0]);

  return <div tabIndex={0} autoFocus={true} ref={ref} className="w-64 rounded-b-md rounded-l-md bg-board focus-within:border-board focus-within:border-8">
    {board.rows.map((row, rowIndex) => {
      return <div key={row.id} className="flex flex-row">
        {row.cells.map((cell, colIndex) => {
          const isCurrentCellInBlock = rotationArrayValue(
            rowIndex,
            colIndex,
            fallingBlockPosition,
            currentBlockRotation
          ) === 1

          // const color = cell === null ? "transparent" : (isCurrentCellInBlock ? fallingColorHex : landedColorHex)
          const color = isCurrentCellInBlock ? fallingColorHex : (cell === null ? "transparent" : landedColorHex)
          return <div key={`${row.id}-${colIndex}`} className="cell" style={{ backgroundColor: color }}/>
        })}
      </div>
    })}
  </div>
})

export default Board
