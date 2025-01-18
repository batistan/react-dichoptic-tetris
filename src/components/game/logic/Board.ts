import {Block, BlockType, getBlockRotations} from "./Blocks.ts";

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 22
export interface Coordinates {
  x: number,
  y: number // "up" (higher y) is closer to the bottom of the board, 0 is the top
}

export const initBlockCoordinates = { x: BOARD_WIDTH / 2, y: -2 }
export interface Row {
  cells: (BlockType | null)[]
}

export interface Board {
  rows: Row[]
}

/**
 * Return cell on `board` at `position`, or `undefined` if not exists
 */
function cellAt(
  board: Board,
  position: Coordinates
): (BlockType | null) | undefined {
  if (
    position.x < 0 ||
    position.y < -2 ||
    position.y > board.rows.length - 1 ||
    position.x > board.rows[0].cells.length - 1
  ) {
    return undefined
  } else {
    return board.rows[position.y].cells[position.x]
  }
}

/**
 * Create a new board with all cells set to `null`, indicating empty
 */
export function initialBoard(width: number, height: number): Board {
  return { rows: Array(height).fill({ cells: Array(width).fill(null) }) }
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
  const rotationArray = getBlockRotations(block)

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

export interface LineClearResult {
  newBoard: Board,
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

  if (rowIndicesToClear.length === 0) return { newBoard: board, rowIndicesCleared: [] }

  const emptyRows = Array(rowIndicesToClear.length).fill({ cells: Array(board.rows[0].cells.length).fill(null) })
  const newRows = [ ...emptyRows, ...board.rows.filter((_, rowIndex) => {
    return !rowIndicesToClear.includes(rowIndex)
  })]

  return { newBoard: { rows: newRows }, rowIndicesCleared: rowIndicesToClear }
}

function isRowFull(row: Row): boolean {
  // row is full if all its cells are non-null
  return row.cells.find((cell) => {
    return cell === null
  }) === undefined
}
