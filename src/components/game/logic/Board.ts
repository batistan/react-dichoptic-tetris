import {Block, BlockType, getRotationArray} from "./Blocks.ts";

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 22
export interface Coordinates {
  x: number,
  y: number // "up" (higher y) is closer to the bottom of the board, 0 is the top
}

export const initBlockCoordinates = { x: BOARD_WIDTH / 2, y: -2 }
export interface Row {
  id: string,
  cells: (BlockType | null)[]
}

export interface Board {
  rows: Row[]
}

/**
 * Return cell (null if empty) on `board` at `position`, or `undefined` if not exists
 */
function cellAt(
  board: Board,
  position: Coordinates
): (BlockType | null) | undefined {
  if (
    position.x < 0 ||
    position.y < -2 || // allow blocks to fall in from above board
    position.y > board.rows.length - 1 ||
    position.x > board.rows[0].cells.length - 1
  ) {
    return undefined
  } else {
    if (position.y < 0) {
      return null
    } else return board.rows[position.y].cells[position.x]
  }
}

/**
 * Create a new board with all cells set to `null`, indicating empty
 */
export function initialBoard(width: number, height: number): Board {
  return { rows: getEmptyRows(height, width) }
}

function getEmptyRows(num: number, width: number): Row[] {
  const rows = Array(num)
  for (let i = 0; i < num; i++) {
    rows[i] = { id: crypto.randomUUID(), cells: Array(width).fill(null) }
  }

  return rows
}

/**
 *
 * @param block Block to check
 * @param position position on board to check
 * @param board board onto which we're trying to place the block
 *
 * @return `true` if the `block` can be placed on the `board` at position `position`, `false` otherwise
 */
export function canPlaceBlock(block: Block, position: Coordinates, board: Board): boolean {
  const rotationArray = getRotationArray(block)

  // check each 1 in the rotation array, get its position on the board, return false if that cell is non-empty
  return rotationArray.find((row, rowIndex) => {
    // row has collision?
    return row.find((_, colIndex) => {
      // cell has collision?
      if (rotationArray[rowIndex][colIndex] === 1) {
        const boardRowIndex = position.y + rowIndex
        const boardColIndex = position.x + colIndex

        const cell = cellAt(board, {x: boardColIndex, y: boardRowIndex})
        return cell === undefined || cell !== null
      } else return false
    }) !== undefined
  }) === undefined
}

export function ghostBlockPosition(block: Block, board: Board, currentBlockPosition: Coordinates): Coordinates {
  let ghostCoords = { ... currentBlockPosition, y: currentBlockPosition.y + 1 };

  while (canPlaceBlock(block, ghostCoords, board)) {
    ghostCoords = { ...ghostCoords, y: ghostCoords.y + 1 }
  }

  return { ...ghostCoords, y: ghostCoords.y - 1 };
}

export function placeBlock(block: Block, position: Coordinates, board: Board): Board {
  const rotationArray = getRotationArray(block)

  const newRows = board.rows.map((row, rowIndex) => {
    const rotationRow = rowIndex - position.y
    if (rotationRow < 0 || rotationRow > rotationArray.length - 1) {
      return row
    } else {
      return { ...row, cells: row.cells.map((cell, colIndex) => {
          const rotationCol = colIndex - position.x

          if (rotationCol < 0 || rotationCol > rotationArray[rotationRow].length - 1) {
            return cell
          } else {
            return rotationArray[rotationRow][rotationCol] === 1 ? block.shape : cell
          }
        })
      }
    }
  })

  return { ...board, rows: [...newRows] }
}

export interface LineClearResult {
  clearedBoard: Board,
  rowIndicesCleared: number[]
}

/**
 *
 * @param board
 *
 * @return `LineClearResult` containing the new `Board`, with filled lines cleared, and an array `rowIndicesCleared`
 * indicating which lines were cleared
 */
export function clearLines(board: Board): LineClearResult {
  const rowIndicesToClear = board.rows
    .map((_, index) => index)
    .filter(rowIndex => isRowFull(board.rows[rowIndex]))

  if (rowIndicesToClear.length === 0) return { clearedBoard: board, rowIndicesCleared: [] }

  const emptyRows = getEmptyRows(rowIndicesToClear.length, board.rows[0].cells.length)

  const newRows = [ ...emptyRows, ...board.rows.filter((_, rowIndex) => {
    return !rowIndicesToClear.includes(rowIndex)
  })]

  return { clearedBoard: { rows: newRows }, rowIndicesCleared: rowIndicesToClear }
}

function isRowFull(row: Row): boolean {
  // row is full if all its cells are non-null
  return row.cells.find((cell) => {
    return cell === null
  }) === undefined
}
