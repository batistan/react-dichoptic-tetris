import { Block, BlockType, blockTypes, RandomBlockGenerator, Rotation } from '../src/components/game/logic/Blocks.ts'
import { Board, initialBoard, Row } from '../src/components/game/logic/Board.ts'

/**
 * Reset the RandomBlockGenerator singleton so each test gets a fresh instance.
 */
export function resetBlockGenerator(): void {
  (RandomBlockGenerator as any).instance = null
}

/**
 * Shorthand to create a Block.
 */
export function block(shape: BlockType, rotation: Rotation = 0): Block {
  return { shape, rotation }
}

/**
 * Create a RandomBlockGenerator with a deterministic sequence of blocks.
 * The sequence repeats when exhausted.
 */
export function deterministicGenerator(blocks: Block[]): RandomBlockGenerator {
  let index = 0
  return new RandomBlockGenerator(() => {
    const result = [blocks[index % blocks.length]]
    index++
    return result
  })
}

/**
 * Create a board where specific rows are completely filled with a given block type.
 */
export function boardWithFilledRows(
  filledRowIndices: number[],
  width = 10,
  height = 22,
  fillType: BlockType = 'T'
): Board {
  const board = initialBoard(width, height)
  return {
    rows: board.rows.map((row, index) => {
      if (filledRowIndices.includes(index)) {
        return { ...row, cells: Array(width).fill(fillType) }
      }
      return row
    })
  }
}

/**
 * Create a board with specific cells filled. Takes an array of {x, y, type} objects.
 */
export function boardWithCells(
  cells: Array<{ x: number; y: number; type: BlockType }>,
  width = 10,
  height = 22
): Board {
  const board = initialBoard(width, height)
  const rows: Row[] = board.rows.map(row => ({ ...row, cells: [...row.cells] }))
  for (const cell of cells) {
    if (cell.y >= 0 && cell.y < height && cell.x >= 0 && cell.x < width) {
      rows[cell.y].cells[cell.x] = cell.type
    }
  }
  return { rows }
}

/**
 * Create a fixed-order block generator that returns all 7 block types in order.
 */
export function orderedGenerator(): RandomBlockGenerator {
  return new RandomBlockGenerator(() =>
    blockTypes.map(shape => ({ shape, rotation: 0 as Rotation }))
  )
}
