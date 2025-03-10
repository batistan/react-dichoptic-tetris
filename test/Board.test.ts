import {Block} from "../src/components/game/logic/Blocks";
import {canPlaceBlock, clearLines, Coordinates, initialBoard} from "../src/components/game/logic/Board";

describe("initialBoard tests", () => {
  test("initialBoard returns a list of rows each containing a list of null with the right dimensions", async () => {
    const width = 10
    const height = 20

    const result = initialBoard(width, height)

    expect(result.rows).toHaveLength(height)
    for (const row of result.rows) {
      expect(row.cells).toHaveLength(width)
      for (const cell of row.cells) {
        expect(cell).toBeNull()
      }
    }
  })
})

describe("canPlaceBlock tests", () => {
  const board = initialBoard(10, 20)

  test("If block can be placed at position, returns true", async () => {
    const block: Block = { shape: "T", rotation: 0 }
    const openPosition: Coordinates = { x: 0, y: 0 }

    const result = canPlaceBlock(block, openPosition, board)

    expect(result).toBeTruthy()
  })

  test("If block cannot be placed at position, returns false", async () => {
    const occupiedRow = { cells: Array(board.rows[0].cells.length).fill("T") }
    const occupiedBoard = {
      rows: [...Array(board.rows.length - 1).fill(
        { cells: [...board.rows[0].cells, ...occupiedRow.cells ]}
      )]
    }
    const block: Block = { shape: "T", rotation: 0 }
    const occupiedPosition: Coordinates = { x: 0, y: occupiedBoard.rows.length - 1 }

    const result = canPlaceBlock(block, occupiedPosition, occupiedBoard)

    expect(result).toBeFalsy()
  })

  test("If position is not valid, returns false", async () => {
    const block: Block = { shape: "T", rotation: 0 }
    const invalidPosition: Coordinates = { x: -1, y: 0 }

    const result = canPlaceBlock(block, invalidPosition, board)

    expect(result).toBeFalsy()
  })
})

describe("clearLines tests", () => {
  const board = initialBoard(10, 20)

  test("clearing single line returns an array with a single value and board with that row cleared", async () => {
    const occupiedRow = { cells: Array(board.rows[0].cells.length).fill("T") }
    const occupiedBoard = {
      rows: [...Array(board.rows.length - 1).fill(
        { cells: [...board.rows[0].cells ] }
      ), occupiedRow]
    }

    const { clearedBoard, rowIndicesCleared } = clearLines(occupiedBoard)

    expect(rowIndicesCleared.length).toBe(1)
    expect(rowIndicesCleared[0]).toBe(19)
    expect(clearedBoard.rows[rowIndicesCleared[0]].cells.find(c => c !== null)).toBeFalsy()
  })

  test("clearing multiple lines shifts all lines down to be adjacent", async () => {
    const occupiedRowOne = { cells: Array(board.rows[0].cells.length).fill("T") }
    const occupiedRowTwo = { cells: Array(board.rows[0].cells.length).fill("L") }

    const partiallyOccupiedRow = { cells: ["T", ...Array(board.rows[0].cells.length - 1).fill(null)]}

    const occupiedBoard = {
      rows: [...Array(board.rows.length - 4).fill(
        { cells: [...board.rows[0].cells ] }
      ), partiallyOccupiedRow, occupiedRowOne, partiallyOccupiedRow, occupiedRowTwo]
    }

    const { clearedBoard, rowIndicesCleared } = clearLines(occupiedBoard)

    expect(rowIndicesCleared.length).toBe(2)
    expect(rowIndicesCleared[0]).toBe(17)
    expect(rowIndicesCleared[1]).toBe(19)
    expect(clearedBoard.rows[19]).toBe(partiallyOccupiedRow)
    expect(clearedBoard.rows[18]).toBe(partiallyOccupiedRow)
  })
})