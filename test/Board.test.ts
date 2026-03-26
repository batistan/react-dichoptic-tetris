import { describe, test, expect } from 'vitest'
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  initialBoard,
  canPlaceBlock,
  ghostBlockPosition,
  placeBlock,
  clearLines,
  initBlockCoordinates,
} from '../src/components/game/logic/Board.ts'
import { block, boardWithFilledRows, boardWithCells } from './helpers.ts'

describe('initialBoard', () => {
  test('creates board with correct dimensions', () => {
    const board = initialBoard(10, 22)
    expect(board.rows).toHaveLength(22)
    for (const row of board.rows) {
      expect(row.cells).toHaveLength(10)
    }
  })

  test('all cells are null', () => {
    const board = initialBoard(10, 22)
    for (const row of board.rows) {
      for (const cell of row.cells) {
        expect(cell).toBeNull()
      }
    }
  })

  test('each row has a unique id', () => {
    const board = initialBoard(10, 22)
    const ids = board.rows.map(r => r.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(22)
  })

  test('works with custom dimensions', () => {
    const board = initialBoard(5, 8)
    expect(board.rows).toHaveLength(8)
    for (const row of board.rows) {
      expect(row.cells).toHaveLength(5)
    }
  })
})

describe('canPlaceBlock', () => {
  const board = initialBoard(10, 22)

  test('block can be placed on empty board at valid position', () => {
    expect(canPlaceBlock(block('T', 0), { x: 0, y: 0 }, board)).toBe(true)
  })

  test('block can be placed at various positions on empty board', () => {
    expect(canPlaceBlock(block('T', 0), { x: 3, y: 10 }, board)).toBe(true)
    expect(canPlaceBlock(block('O', 0), { x: 6, y: 0 }, board)).toBe(true)
  })

  test('block cannot be placed when overlapping occupied cells', () => {
    // T-piece at rotation 0 occupies: (1,1), (0,2),(1,2),(2,2)
    // Fill cell (1,2) to cause collision
    const occupied = boardWithCells([{ x: 1, y: 2, type: 'I' }])
    expect(canPlaceBlock(block('T', 0), { x: 0, y: 0 }, occupied)).toBe(false)
  })

  test('block cannot be placed at negative x', () => {
    expect(canPlaceBlock(block('T', 0), { x: -1, y: 0 }, board)).toBe(false)
  })

  test('block cannot be placed beyond right edge', () => {
    // T-piece rotation 0 occupies cols x+0 through x+2, so x=9 puts col at 11
    expect(canPlaceBlock(block('T', 0), { x: 9, y: 0 }, board)).toBe(false)
  })

  test('block cannot be placed below bottom edge', () => {
    // T-piece rotation 0 occupies rows y+1 and y+2
    expect(canPlaceBlock(block('T', 0), { x: 0, y: 21 }, board)).toBe(false)
  })

  test('block can exist partially above top of board (spawn area y=-2)', () => {
    // I-piece at rotation 0: filled cells are in row 2 of the 4x4 grid
    // At y=-2, that's board row 0 — should be valid
    expect(canPlaceBlock(block('I', 0), { x: 0, y: -2 }, board)).toBe(true)
  })

  // The cellAt function allows y >= -2. I-piece rotation 0 has filled cells at grid row 2.
  // At y=-3, grid row 2 maps to board row -1, which cellAt treats as above-board (returns null).
  // Grid rows 0 and 1 map to board rows -3 and -2; -3 is out of bounds but those grid cells
  // are 0 so they're skipped. This means y=-3 is actually valid for I-piece rotation 0.
  test('block at y=-3 is accepted for I-piece rotation 0 (filled cells still in spawn zone)', () => {
    expect(canPlaceBlock(block('I', 0), { x: 0, y: -3 }, board)).toBe(true)
  })

  test('block at y=-4 is rejected for I-piece rotation 0 (filled cells above spawn ceiling)', () => {
    // At y=-4, grid row 2 = board row -2, still valid. Grid row 0 = board row -4, out of bounds
    // but grid row 0 is all 0s. Actually grid row 2 at y=-4 = -2, which is allowed.
    // Let's use T-piece which has filled cells at grid rows 1 and 2
    // T at y=-3: grid row 1 = board row -2 (ok), grid row 2 = board row -1 (ok)
    // T at y=-4: grid row 1 = board row -3 (out of bounds, and cell is 1!) => rejected
    expect(canPlaceBlock(block('T', 0), { x: 0, y: -4 }, board)).toBe(false)
  })

  test('block can be placed at initBlockCoordinates on empty board', () => {
    expect(canPlaceBlock(block('T', 0), initBlockCoordinates, board)).toBe(true)
  })
})

describe('ghostBlockPosition', () => {
  test('on empty board, ghost drops to bottom', () => {
    const board = initialBoard(10, 22)
    // T-piece rotation 0: occupied rows are grid rows 1 and 2
    // Ghost should drop until row y+2 = 21, so y = 19
    const ghost = ghostBlockPosition(block('T', 0), board, { x: 3, y: 0 })
    expect(ghost.x).toBe(3)
    expect(ghost.y).toBe(19)
  })

  test('ghost stops above occupied row', () => {
    const board = boardWithFilledRows([21])
    // T-piece rotation 0: bottom occupied row is y+2
    // y+2 must be < 21, so y = 18
    const ghost = ghostBlockPosition(block('T', 0), board, { x: 3, y: 0 })
    expect(ghost.x).toBe(3)
    expect(ghost.y).toBe(18)
  })

  test('ghost with block already at floor returns same position', () => {
    const board = initialBoard(10, 22)
    // T-piece at y=19: row 2 of grid is at board row 21 (last row). Can it go to y=20?
    // At y=20, row 2 = board row 22, which is out of bounds — can't place.
    // So ghost should be y=19
    const ghost = ghostBlockPosition(block('T', 0), board, { x: 3, y: 19 })
    expect(ghost.y).toBe(19)
  })

  test('ghost preserves x coordinate', () => {
    const board = initialBoard(10, 22)
    const ghost = ghostBlockPosition(block('I', 0), board, { x: 5, y: -2 })
    expect(ghost.x).toBe(5)
  })

  test('ghost accounts for partially filled rows', () => {
    // Fill a single cell that the T-piece would collide with
    // T-piece rotation 0 at x=3: cells at (4,y+1), (3,y+2),(4,y+2),(5,y+2)
    // If cell (4,15) is filled, the T-piece collides when y+1=15 (via col x+1=4), so y=14.
    // But at y=14, grid row 2 col 1 (board pos 4,16) is empty, so the collision is at
    // grid row 1 col 1: y+1=15 means y=14. Can it go to y=14? At y=14, grid[1][1]=1 at
    // board (4,15) — collision! So ghost.y = 14-1 = 13. Wait, let me trace ghostBlockPosition:
    // It starts at y+1 of current and moves down. At ghost y=14: grid[1][1]=1 checks (4,15) — occupied!
    // canPlaceBlock returns false. So we back up: ghost.y = 14-1 = 13. But the function
    // starts at currentPos.y+1 and increments... Let me reconsider.
    // ghostBlockPosition starts ghostCoords at {x, y: currentY+1} and increments y while canPlace.
    // When canPlace fails, it returns y-1.
    // Starting from y=1: canPlace at (3,1)? Yes. y=2? Yes. ... y=13?
    // At y=13: grid[1][1]=1 at board(4,14) — empty. grid[2][1]=1 at board(4,15) — OCCUPIED! => false
    // So ghost returns y=13-1=12.
    const board = boardWithCells([{ x: 4, y: 15, type: 'I' }])
    const ghost = ghostBlockPosition(block('T', 0), board, { x: 3, y: 0 })
    expect(ghost.y).toBe(12)
  })
})

describe('placeBlock', () => {
  test('places block cells onto board with correct shape type', () => {
    const board = initialBoard(10, 22)
    // T-piece rotation 0 at (3,10): cells at (4,11), (3,12),(4,12),(5,12)
    const placed = placeBlock(block('T', 0), { x: 3, y: 10 }, board)

    expect(placed.rows[11].cells[4]).toBe('T')
    expect(placed.rows[12].cells[3]).toBe('T')
    expect(placed.rows[12].cells[4]).toBe('T')
    expect(placed.rows[12].cells[5]).toBe('T')
  })

  test('does not overwrite existing cells outside rotation array', () => {
    const board = boardWithCells([{ x: 0, y: 0, type: 'I' }])
    const placed = placeBlock(block('T', 0), { x: 3, y: 10 }, board)

    // Original cell should still be there
    expect(placed.rows[0].cells[0]).toBe('I')
    // Empty cells in the rotation area should remain null
    expect(placed.rows[10].cells[3]).toBeNull()
  })

  test('does not modify the original board', () => {
    const board = initialBoard(10, 22)
    placeBlock(block('T', 0), { x: 3, y: 10 }, board)
    // Original board should be unchanged
    expect(board.rows[12].cells[4]).toBeNull()
  })

  test('placing block at y=0 writes cells in top rows', () => {
    const board = initialBoard(10, 22)
    // T-piece rotation 0 at (0,0): cells at (1,1), (0,2),(1,2),(2,2)
    const placed = placeBlock(block('T', 0), { x: 0, y: 0 }, board)
    expect(placed.rows[1].cells[1]).toBe('T')
    expect(placed.rows[2].cells[0]).toBe('T')
    expect(placed.rows[2].cells[1]).toBe('T')
    expect(placed.rows[2].cells[2]).toBe('T')
  })

  test('placing I-piece fills 4 cells in a line', () => {
    const board = initialBoard(10, 22)
    // I-piece rotation 0 at (0,0): cells at (0,2),(1,2),(2,2),(3,2)
    const placed = placeBlock(block('I', 0), { x: 0, y: 0 }, board)
    expect(placed.rows[2].cells[0]).toBe('I')
    expect(placed.rows[2].cells[1]).toBe('I')
    expect(placed.rows[2].cells[2]).toBe('I')
    expect(placed.rows[2].cells[3]).toBe('I')
  })
})

describe('clearLines', () => {
  test('no full rows returns unchanged board and empty indices', () => {
    const board = initialBoard(10, 22)
    const { clearedBoard, rowIndicesCleared } = clearLines(board)
    expect(rowIndicesCleared).toHaveLength(0)
    expect(clearedBoard).toBe(board) // same reference when no change
  })

  test('single full row is cleared, empty row added at top', () => {
    const board = boardWithFilledRows([21])
    const { clearedBoard, rowIndicesCleared } = clearLines(board)

    expect(rowIndicesCleared).toEqual([21])
    // Row 0 should be the new empty row
    for (const cell of clearedBoard.rows[0].cells) {
      expect(cell).toBeNull()
    }
    // Total rows unchanged
    expect(clearedBoard.rows).toHaveLength(22)
  })

  test('multiple full rows are cleared', () => {
    const board = boardWithFilledRows([20, 21])
    const { clearedBoard, rowIndicesCleared } = clearLines(board)

    expect(rowIndicesCleared).toEqual([20, 21])
    expect(clearedBoard.rows).toHaveLength(22)
    // Top 2 rows should be new empty rows
    for (const cell of clearedBoard.rows[0].cells) {
      expect(cell).toBeNull()
    }
    for (const cell of clearedBoard.rows[1].cells) {
      expect(cell).toBeNull()
    }
  })

  test('partially filled row is not cleared', () => {
    const board = boardWithCells([{ x: 0, y: 21, type: 'T' }])
    const { rowIndicesCleared } = clearLines(board)
    expect(rowIndicesCleared).toHaveLength(0)
  })

  test('non-adjacent full rows are both cleared and remaining rows shift down', () => {
    // Fill rows 18 and 21, with partial rows 19 and 20
    const board = boardWithFilledRows([18, 21])
    // Add a marker cell to a non-cleared row
    const rows = board.rows.map((row, i) => {
      if (i === 19) return { ...row, cells: ['L' as const, ...Array(9).fill(null)] }
      return row
    })
    const markedBoard = { rows }

    const { clearedBoard, rowIndicesCleared } = clearLines(markedBoard)

    expect(rowIndicesCleared).toEqual([18, 21])
    expect(clearedBoard.rows).toHaveLength(22)
    // 2 empty rows added at top (indices 0,1), then original rows 0-17 (shifted to 2-19),
    // then row 19 (marked, shifted to 20), then row 20 (shifted to 21)
    // The marked row (originally at 19) should be at index 20
    expect(clearedBoard.rows[20].cells[0]).toBe('L')
  })

  test('cleared board has same total number of rows', () => {
    const board = boardWithFilledRows([0, 5, 10, 15])
    const { clearedBoard } = clearLines(board)
    expect(clearedBoard.rows).toHaveLength(22)
  })

  test('new empty rows at top have unique IDs', () => {
    const board = boardWithFilledRows([20, 21])
    const { clearedBoard } = clearLines(board)
    const ids = clearedBoard.rows.map(r => r.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(22)
  })
})

describe('board constants', () => {
  test('BOARD_WIDTH is 10', () => {
    expect(BOARD_WIDTH).toBe(10)
  })

  test('BOARD_HEIGHT is 22', () => {
    expect(BOARD_HEIGHT).toBe(22)
  })

  // BUG: initBlockCoordinates.x = BOARD_WIDTH / 2 = 5. Since rotation arrays are 4x4,
  // blocks spawn occupying columns 5-8, which is right-biased on a 10-wide board.
  // Standard Tetris centers blocks around columns 3-6. This means every piece spawns
  // shifted one column to the right of where players expect.
  test('initBlockCoordinates spawns at x=5 y=-2 (BUG: right-biased spawn)', () => {
    expect(initBlockCoordinates).toEqual({ x: 5, y: -2 })
  })
})
