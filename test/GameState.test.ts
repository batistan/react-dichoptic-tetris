import { describe, test, expect, beforeEach } from 'vitest'
import {
  GameState,
  GameStateAction,
  getNextGameState,
  initialGameState,
  calculateLevel,
} from '../src/components/game/logic/GameState.ts'
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  canPlaceBlock,
  initialBoard,
  initBlockCoordinates,
  placeBlock,
} from '../src/components/game/logic/Board.ts'
import { blockTypes, RandomBlockGenerator } from '../src/components/game/logic/Blocks.ts'
import { resetBlockGenerator, block, boardWithFilledRows, boardWithCells } from './helpers.ts'

beforeEach(() => {
  resetBlockGenerator()
})

describe('calculateLevel', () => {
  test('0 lines cleared => level 1', () => {
    expect(calculateLevel(0)).toBe(1)
  })

  test('9 lines cleared => level 1', () => {
    expect(calculateLevel(9)).toBe(1)
  })

  test('10 lines cleared => level 2', () => {
    expect(calculateLevel(10)).toBe(2)
  })

  test('25 lines cleared => level 3', () => {
    expect(calculateLevel(25)).toBe(3)
  })

  test('99 lines cleared => level 10', () => {
    expect(calculateLevel(99)).toBe(10)
  })
})

describe('initialGameState', () => {
  test('returns state with empty board of BOARD_WIDTH x BOARD_HEIGHT', () => {
    const state = initialGameState()
    expect(state.board.rows).toHaveLength(BOARD_HEIGHT)
    for (const row of state.board.rows) {
      expect(row.cells).toHaveLength(BOARD_WIDTH)
      for (const cell of row.cells) {
        expect(cell).toBeNull()
      }
    }
  })

  test('returns 6 nextBlocks', () => {
    const state = initialGameState()
    expect(state.nextBlocks).toHaveLength(6)
  })

  test('all nextBlocks have valid shapes and rotation 0', () => {
    const state = initialGameState()
    for (const b of state.nextBlocks) {
      expect(blockTypes).toContain(b.shape)
      expect(b.rotation).toBe(0)
    }
  })

  test('currentBlockPosition equals initBlockCoordinates', () => {
    const state = initialGameState()
    expect(state.currentBlockPosition).toEqual(initBlockCoordinates)
  })

  test('ghostBlockPosition is calculated for the first block', () => {
    const state = initialGameState()
    // Ghost should be below the spawn point
    expect(state.ghostBlockPosition.y).toBeGreaterThan(state.currentBlockPosition.y)
  })

  test('heldBlock is null, canHold is true', () => {
    const state = initialGameState()
    expect(state.heldBlock).toBeNull()
    expect(state.canHold).toBe(true)
  })

  test('score and linesCleared are 0', () => {
    const state = initialGameState()
    expect(state.score).toBe(0)
    expect(state.linesCleared).toBe(0)
  })

  test('isStarted is false, isOver is false, isPaused is false', () => {
    const state = initialGameState()
    expect(state.isStarted).toBe(false)
    expect(state.isOver).toBe(false)
    expect(state.isPaused).toBe(false)
  })
})

describe('getNextGameState', () => {
  // Helper to create a basic playable state
  function playableState(): GameState {
    const state = initialGameState()
    return { ...state, isStarted: true }
  }

  describe('PAUSE', () => {
    test('toggles isPaused from false to true', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.PAUSE)
      expect(next.isPaused).toBe(true)
    })

    test('toggles isPaused from true to false', () => {
      const state = { ...playableState(), isPaused: true }
      const next = getNextGameState(state, GameStateAction.PAUSE)
      expect(next.isPaused).toBe(false)
    })

    test('does nothing if game is over', () => {
      const state = { ...playableState(), isOver: true }
      const next = getNextGameState(state, GameStateAction.PAUSE)
      expect(next).toBe(state) // same reference
    })
  })

  describe('RESTART', () => {
    test('returns a fresh initialGameState', () => {
      const state = { ...playableState(), score: 500, linesCleared: 20 }
      const next = getNextGameState(state, GameStateAction.RESTART)
      expect(next.score).toBe(0)
      expect(next.linesCleared).toBe(0)
      expect(next.isOver).toBe(false)
      expect(next.nextBlocks).toHaveLength(6)
    })
  })

  describe('MOVE_LEFT', () => {
    test('decrements x by 1 when space available', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.MOVE_LEFT)
      expect(next.currentBlockPosition.x).toBe(state.currentBlockPosition.x - 1)
    })

    test('updates ghostBlockPosition on horizontal move', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.MOVE_LEFT)
      expect(next.ghostBlockPosition.x).toBe(state.ghostBlockPosition.x - 1)
    })

    test('does not move if blocked by wall', () => {
      // Move left until hitting the wall, then try one more
      let state = playableState()
      // Keep moving left until we can't anymore
      for (let i = 0; i < 20; i++) {
        const next = getNextGameState(state, GameStateAction.MOVE_LEFT)
        if (next.currentBlockPosition.x === state.currentBlockPosition.x) break
        state = next
      }
      const blocked = getNextGameState(state, GameStateAction.MOVE_LEFT)
      expect(blocked.currentBlockPosition.x).toBe(state.currentBlockPosition.x)
    })

    test('no-op when paused', () => {
      const state = { ...playableState(), isPaused: true }
      const next = getNextGameState(state, GameStateAction.MOVE_LEFT)
      expect(next).toBe(state)
    })

    test('no-op when game over', () => {
      const state = { ...playableState(), isOver: true }
      const next = getNextGameState(state, GameStateAction.MOVE_LEFT)
      expect(next).toBe(state)
    })
  })

  describe('MOVE_RIGHT', () => {
    test('increments x by 1 when space available', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.MOVE_RIGHT)
      expect(next.currentBlockPosition.x).toBe(state.currentBlockPosition.x + 1)
    })

    test('updates ghostBlockPosition on horizontal move', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.MOVE_RIGHT)
      expect(next.ghostBlockPosition.x).toBe(state.ghostBlockPosition.x + 1)
    })

    test('no-op when paused', () => {
      const state = { ...playableState(), isPaused: true }
      const next = getNextGameState(state, GameStateAction.MOVE_RIGHT)
      expect(next).toBe(state)
    })
  })

  describe('MOVE_DOWN', () => {
    test('increments y by 1 when space below', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.MOVE_DOWN)
      expect(next.currentBlockPosition.y).toBe(state.currentBlockPosition.y + 1)
    })

    test('awards +1 score for soft drop', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.MOVE_DOWN)
      expect(next.score).toBe(state.score + 1)
    })

    test('lands block when cannot move further down', () => {
      // Move block all the way to the ghost position, then one more tick
      const state = playableState()
      const atGhost = {
        ...state,
        currentBlockPosition: state.ghostBlockPosition,
      }
      const next = getNextGameState(atGhost, GameStateAction.MOVE_DOWN)
      // Block should have landed: current position resets to spawn
      expect(next.currentBlockPosition).toEqual(initBlockCoordinates)
    })

    // BUG: MOVE_DOWN and TICK do not recalculate ghostBlockPosition. The ghost
    // position from the last horizontal move or rotation persists. During normal
    // downward movement the board doesn't change, so the ghost destination is
    // still correct — but the state carries a stale ghostBlockPosition that is
    // higher than the current block, which could confuse rendering or hard-drop
    // scoring if the state is inspected between moves.
    test('does NOT update ghostBlockPosition on downward move (BUG: ghost not recalculated)', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.MOVE_DOWN)
      // Ghost should ideally update but it doesn't
      expect(next.ghostBlockPosition).toEqual(state.ghostBlockPosition)
    })

    // BUG: MOVE_DOWN and TICK share a case branch that does NOT check isPaused or isOver.
    // This means blocks continue to fall and soft-drop points are awarded even while paused
    // or after game over. All other actions (MOVE_LEFT, MOVE_RIGHT, ROTATE, HOLD, HARD_DROP)
    // correctly guard against these states.
    test('MOVE_DOWN still processes when paused (BUG: missing isPaused guard)', () => {
      const state = { ...playableState(), isPaused: true }
      const next = getNextGameState(state, GameStateAction.MOVE_DOWN)
      // Should be a no-op but isn't — the block moves down and scores a point
      expect(next.currentBlockPosition.y).toBe(state.currentBlockPosition.y + 1)
      expect(next.score).toBe(state.score + 1)
    })
  })

  describe('TICK', () => {
    test('moves block down by 1', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.TICK)
      expect(next.currentBlockPosition.y).toBe(state.currentBlockPosition.y + 1)
    })

    test('does NOT award score (unlike MOVE_DOWN)', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.TICK)
      expect(next.score).toBe(state.score)
    })

    test('lands block when cannot move further down', () => {
      const state = playableState()
      const atGhost = {
        ...state,
        currentBlockPosition: state.ghostBlockPosition,
      }
      const next = getNextGameState(atGhost, GameStateAction.TICK)
      expect(next.currentBlockPosition).toEqual(initBlockCoordinates)
    })
  })

  describe('ROTATE_CLOCKWISE', () => {
    test('rotates current block clockwise', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.ROTATE_CLOCKWISE)
      expect(next.nextBlocks[0].rotation).toBe(1)
      expect(next.nextBlocks[0].shape).toBe(state.nextBlocks[0].shape)
    })

    test('updates ghostBlockPosition after rotation', () => {
      const state = playableState()
      const before = state.ghostBlockPosition
      const next = getNextGameState(state, GameStateAction.ROTATE_CLOCKWISE)
      // Ghost is recalculated (may or may not change depending on shape)
      expect(next.ghostBlockPosition).toBeDefined()
      // At minimum, x should remain the same since we didn't move horizontally
      expect(next.ghostBlockPosition.x).toBe(before.x)
    })

    test('does not rotate if rotated block cannot be placed', () => {
      // Put block right against the wall where rotation would clip
      const state = playableState()
      // I-piece rotation 1 is vertical (column 1). At x=9, rotating to horizontal
      // would need cols 9,10,11,12 — out of bounds
      const iState = {
        ...state,
        nextBlocks: [block('I', 1), ...state.nextBlocks.slice(1)],
        currentBlockPosition: { x: 9, y: 5 },
      }
      const next = getNextGameState(iState, GameStateAction.ROTATE_CLOCKWISE)
      expect(next.nextBlocks[0].rotation).toBe(1) // unchanged
    })

    test('no-op when paused', () => {
      const state = { ...playableState(), isPaused: true }
      const next = getNextGameState(state, GameStateAction.ROTATE_CLOCKWISE)
      expect(next).toBe(state)
    })
  })

  describe('ROTATE_ANTI_CLOCKWISE', () => {
    test('rotates current block anti-clockwise', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.ROTATE_ANTI_CLOCKWISE)
      expect(next.nextBlocks[0].rotation).toBe(3) // 0 -> 3
    })

    test('does not rotate if placement invalid', () => {
      const state = playableState()
      const iState = {
        ...state,
        nextBlocks: [block('I', 3), ...state.nextBlocks.slice(1)],
        currentBlockPosition: { x: 9, y: 5 },
      }
      const next = getNextGameState(iState, GameStateAction.ROTATE_ANTI_CLOCKWISE)
      expect(next.nextBlocks[0].rotation).toBe(3) // unchanged
    })
  })

  describe('HARD_DROP', () => {
    test('moves block to ghost position and lands it', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.HARD_DROP)
      // Block should have landed: position resets to spawn
      expect(next.currentBlockPosition).toEqual(initBlockCoordinates)
      // The previous block should be placed on the board
      expect(next.board).not.toEqual(state.board)
    })

    test('awards score equal to distance dropped', () => {
      const state = playableState()
      const distance = state.ghostBlockPosition.y - state.currentBlockPosition.y
      const next = getNextGameState(state, GameStateAction.HARD_DROP)
      // Score should include the drop distance (no line clear bonus on empty board)
      expect(next.score).toBeGreaterThanOrEqual(distance)
    })

    test('advances to next block', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.HARD_DROP)
      // New current block should be what was previously nextBlocks[1]
      expect(next.nextBlocks[0].shape).toBe(state.nextBlocks[1].shape)
    })

    test('nextBlocks still has 6 elements after hard drop', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.HARD_DROP)
      expect(next.nextBlocks).toHaveLength(6)
    })

    test('no-op when paused', () => {
      const state = { ...playableState(), isPaused: true }
      const next = getNextGameState(state, GameStateAction.HARD_DROP)
      expect(next).toBe(state)
    })

    test('no-op when game over', () => {
      const state = { ...playableState(), isOver: true }
      const next = getNextGameState(state, GameStateAction.HARD_DROP)
      expect(next).toBe(state)
    })
  })

  describe('HOLD', () => {
    test('first hold: current block goes to held, next block becomes current', () => {
      const state = playableState()
      const currentShape = state.nextBlocks[0].shape
      const nextShape = state.nextBlocks[1].shape

      const next = getNextGameState(state, GameStateAction.HOLD)

      expect(next.heldBlock?.shape).toBe(currentShape)
      expect(next.nextBlocks[0].shape).toBe(nextShape)
    })

    test('subsequent hold: swaps current with held block', () => {
      const state = playableState()
      // First hold
      const afterFirstHold = getNextGameState(state, GameStateAction.HOLD)
      // Land the block to reset canHold
      let landed = afterFirstHold
      for (let i = 0; i < 30; i++) {
        const next = getNextGameState(landed, GameStateAction.TICK)
        if (next.currentBlockPosition.y === initBlockCoordinates.y) {
          landed = next
          break
        }
        landed = next
      }
      // Now hold again
      const heldShape = landed.heldBlock?.shape
      const currentShape = landed.nextBlocks[0].shape

      const afterSecondHold = getNextGameState(landed, GameStateAction.HOLD)

      expect(afterSecondHold.nextBlocks[0].shape).toBe(heldShape)
      expect(afterSecondHold.heldBlock?.shape).toBe(currentShape)
    })

    test('held block rotation resets to 0', () => {
      const state = playableState()
      // Rotate current block first
      const rotated = getNextGameState(state, GameStateAction.ROTATE_CLOCKWISE)
      expect(rotated.nextBlocks[0].rotation).toBe(1)

      // Now hold it
      const held = getNextGameState(rotated, GameStateAction.HOLD)
      expect(held.heldBlock?.rotation).toBe(0)
    })

    test('canHold becomes false after hold', () => {
      const state = playableState()
      const next = getNextGameState(state, GameStateAction.HOLD)
      expect(next.canHold).toBe(false)
    })

    test('cannot hold twice without landing', () => {
      const state = playableState()
      const first = getNextGameState(state, GameStateAction.HOLD)
      const second = getNextGameState(first, GameStateAction.HOLD)
      expect(second).toBe(first) // no change
    })

    test('currentBlockPosition resets to initBlockCoordinates after hold', () => {
      const state = playableState()
      // Move down a few times first
      let moved = state
      for (let i = 0; i < 3; i++) {
        moved = getNextGameState(moved, GameStateAction.MOVE_DOWN)
      }
      const held = getNextGameState(moved, GameStateAction.HOLD)
      expect(held.currentBlockPosition).toEqual(initBlockCoordinates)
    })

    // BUG: When holding, the new current block (either from nextBlocks[1] on first hold
    // or from heldBlock on subsequent holds) is placed at initBlockCoordinates without
    // checking canPlaceBlock. If the board is stacked high near the spawn area, the
    // swapped-in block could overlap existing pieces, creating an invalid game state.
    // The game only checks for game-over on landing, not on hold.
    test('hold does not validate placement of swapped block (BUG: no canPlaceBlock check)', () => {
      const state = playableState()
      // Stack the board high near spawn position
      const cells: Array<{ x: number; y: number; type: 'T' }> = []
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          // Leave column 5 and 6 clear for the current block to exist
          // but fill everything else
          if (x < 4 || x > 7) {
            cells.push({ x, y, type: 'T' })
          }
        }
      }
      const stackedBoard = boardWithCells(cells)

      // Create a state with a stacked board and a held block
      const stackedState: GameState = {
        ...state,
        board: stackedBoard,
        heldBlock: block('I', 1), // vertical I-piece might conflict
        canHold: true,
      }

      // Hold should succeed without checking placement — this is the bug.
      // It does NOT throw or return the previous state.
      const next = getNextGameState(stackedState, GameStateAction.HOLD)
      expect(next.canHold).toBe(false) // hold was performed
      expect(next.heldBlock?.shape).toBe(stackedState.nextBlocks[0].shape)
    })

    test('no-op when paused', () => {
      const state = { ...playableState(), isPaused: true }
      const next = getNextGameState(state, GameStateAction.HOLD)
      expect(next).toBe(state)
    })
  })

  describe('landing and game over', () => {
    test('after landing, nextBlocks shifts and new block is appended', () => {
      const state = playableState()
      const originalSecond = state.nextBlocks[1]

      // Drop the block
      const next = getNextGameState(state, GameStateAction.HARD_DROP)

      // nextBlocks[0] should now be what was nextBlocks[1]
      expect(next.nextBlocks[0].shape).toBe(originalSecond.shape)
      // Should still have 6 blocks
      expect(next.nextBlocks).toHaveLength(6)
    })

    test('canHold resets to true after landing', () => {
      const state = playableState()
      // Hold first
      const held = getNextGameState(state, GameStateAction.HOLD)
      expect(held.canHold).toBe(false)

      // Now drop to land the block
      const landed = getNextGameState(held, GameStateAction.HARD_DROP)
      expect(landed.canHold).toBe(true)
    })

    test('game over when next block cannot be placed at spawn position', () => {
      const state = playableState()
      // Fill nearly all rows, but leave gaps so lines won't clear (preventing the
      // board from opening up space). Fill all rows with a checkerboard pattern
      // that leaves column 5 partially open for the current block to land,
      // but blocks the next block at spawn.
      const cells: Array<{ x: number; y: number; type: 'T' }> = []
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          // Leave a gap in each row so no line clears
          // But fill the spawn area columns (5-8) to block next block
          if (x !== 0) {
            cells.push({ x, y, type: 'T' })
          }
        }
      }
      const stackedBoard = boardWithCells(cells)

      // Use I-piece vertical (rotation 1): fills column x+1 across rows y+0 to y+3
      // At (initBlockCoordinates), that's column 6 at rows -2 to 1.
      // Rows -2 and -1 are above board (skipped by placeBlock).
      // Rows 0 and 1 at column 6: already filled with 'T', but placeBlock overwrites with 'I'.
      // After placing, no lines clear (col 0 has gaps).
      // Next block at initBlockCoordinates will collide with the stacked board.
      const gameOverState: GameState = {
        ...state,
        board: stackedBoard,
        nextBlocks: [block('I', 1), ...state.nextBlocks.slice(1)],
        currentBlockPosition: initBlockCoordinates,
        ghostBlockPosition: initBlockCoordinates,
      }

      const next = getNextGameState(gameOverState, GameStateAction.TICK)
      expect(next.isOver).toBe(true)
    })
  })

  describe('scoring', () => {
    // Helper: create a state where landing the current block clears N lines
    function stateWithNLinesClearable(n: number): GameState {
      const state = playableState()
      const currentBlock = state.nextBlocks[0]

      // Fill bottom N rows completely except for cells the block will fill
      const filledIndices = Array.from({ length: n }, (_, i) => BOARD_HEIGHT - 1 - i)
      const board = boardWithFilledRows(filledIndices)

      // We need to use the I-piece for reliable line clears
      // I-piece at rotation 1 (vertical) fills one column across 4 rows
      // For a proper test, place I-piece horizontally on a nearly-full row
      return {
        ...state,
        board,
        nextBlocks: [block('I', 0), ...state.nextBlocks.slice(1)],
      }
    }

    test('single line clear at level 1 (0 prior lines) scores 40 * (1+1) = 80', () => {
      const state = playableState()

      // Build a board with row 21 almost full — leave cols 0-3 empty (I-piece will fill them)
      const board = initialBoard(BOARD_WIDTH, BOARD_HEIGHT)
      const rows = board.rows.map((row, y) => {
        if (y === BOARD_HEIGHT - 1) {
          // Fill cols 4-9, leave 0-3 for I-piece
          return { ...row, cells: row.cells.map((_, x) => x >= 4 ? 'T' as const : null) }
        }
        return row
      })

      const testState: GameState = {
        ...state,
        board: { rows },
        // I-piece horizontal at y that will land on row 21 (row index 19-20 area)
        nextBlocks: [block('I', 0), ...state.nextBlocks.slice(1)],
        currentBlockPosition: { x: -2, y: BOARD_HEIGHT - 3 },
        ghostBlockPosition: { x: -2, y: BOARD_HEIGHT - 3 },
        linesCleared: 0,
        score: 0,
      }

      // I-piece rotation 0: filled at grid row 2, cols 0-3
      // At position {x: -2, y: BOARD_HEIGHT-3}, grid row 2 = board row BOARD_HEIGHT-1
      // Cols: -2+0=-2 (off board), -2+1=-1 (off board), -2+2=0, -2+3=1
      // That only places 2 cells on the board, not enough for a full line

      // Let's use a simpler approach: place I-piece at x=0 to fill cols 0-3
      const testState2: GameState = {
        ...state,
        board: { rows },
        nextBlocks: [block('I', 0), ...state.nextBlocks.slice(1)],
        currentBlockPosition: { x: 0, y: BOARD_HEIGHT - 3 },
        ghostBlockPosition: { x: 0, y: BOARD_HEIGHT - 3 },
        linesCleared: 0,
        score: 0,
      }

      // I-piece rotation 0 at (0, 19): row 2 of grid = board row 21, fills cols 0,1,2,3
      // Row 21 already has cols 4-9 filled => full line!
      const next = getNextGameState(testState2, GameStateAction.TICK)

      // Block can't move down (y+1 would put grid row 2 at board row 22, out of bounds)
      // So it lands, clears 1 line, scores 40 * (level + 1) = 40 * 2 = 80
      expect(next.linesCleared).toBe(1)
      expect(next.score).toBe(80)
    })

    test('level calculation affects scoring: lines at level 2 score higher', () => {
      const state = playableState()

      const board = initialBoard(BOARD_WIDTH, BOARD_HEIGHT)
      const rows = board.rows.map((row, y) => {
        if (y === BOARD_HEIGHT - 1) {
          return { ...row, cells: row.cells.map((_, x) => x >= 4 ? 'T' as const : null) }
        }
        return row
      })

      const testState: GameState = {
        ...state,
        board: { rows },
        nextBlocks: [block('I', 0), ...state.nextBlocks.slice(1)],
        currentBlockPosition: { x: 0, y: BOARD_HEIGHT - 3 },
        ghostBlockPosition: { x: 0, y: BOARD_HEIGHT - 3 },
        linesCleared: 10, // level 2
        score: 0,
      }

      const next = getNextGameState(testState, GameStateAction.TICK)
      // Single line at level 2: 40 * (2 + 1) = 120
      expect(next.linesCleared).toBe(11)
      expect(next.score).toBe(120)
    })

    test('hard drop awards 1 point per row of distance', () => {
      const state = playableState()
      const distance = state.ghostBlockPosition.y - state.currentBlockPosition.y
      expect(distance).toBeGreaterThan(0) // sanity check

      const next = getNextGameState(state, GameStateAction.HARD_DROP)
      // On empty board, no line clears, so score = distance only
      expect(next.score).toBe(distance)
    })

    test('soft drop (MOVE_DOWN) awards 1 point per row', () => {
      const state = { ...playableState(), score: 0 }
      const after1 = getNextGameState(state, GameStateAction.MOVE_DOWN)
      expect(after1.score).toBe(1)
      const after2 = getNextGameState(after1, GameStateAction.MOVE_DOWN)
      expect(after2.score).toBe(2)
    })

    test('TICK does not award soft drop points', () => {
      const state = { ...playableState(), score: 0 }
      const next = getNextGameState(state, GameStateAction.TICK)
      expect(next.score).toBe(0)
    })
  })

  describe('action guards', () => {
    // BUG: MOVE_DOWN and TICK do NOT check isPaused or isOver, unlike all other actions.
    // They share a case branch (GameState.ts:135-148) that has no guard clause.
    const properlyGuardedActions = [
      GameStateAction.MOVE_LEFT,
      GameStateAction.MOVE_RIGHT,
      GameStateAction.ROTATE_CLOCKWISE,
      GameStateAction.ROTATE_ANTI_CLOCKWISE,
      GameStateAction.HARD_DROP,
      GameStateAction.HOLD,
    ]

    test('properly guarded actions are no-ops when game is over', () => {
      const state = { ...playableState(), isOver: true }
      for (const action of properlyGuardedActions) {
        const next = getNextGameState(state, action)
        expect(next).toBe(state)
      }
    })

    test('properly guarded actions are no-ops when game is paused', () => {
      const state = { ...playableState(), isPaused: true }
      for (const action of properlyGuardedActions) {
        const next = getNextGameState(state, action)
        expect(next).toBe(state)
      }
    })

    // BUG: MOVE_DOWN and TICK still process when paused or game is over.
    // This means gravity continues during pause and soft-drop works after game over.
    test('MOVE_DOWN and TICK are NOT guarded by isPaused/isOver (BUG)', () => {
      const pausedState = { ...playableState(), isPaused: true }
      const overState = { ...playableState(), isOver: true }

      // Both should be no-ops but aren't
      const afterTickPaused = getNextGameState(pausedState, GameStateAction.TICK)
      expect(afterTickPaused.currentBlockPosition.y).toBe(pausedState.currentBlockPosition.y + 1)

      const afterDownOver = getNextGameState(overState, GameStateAction.MOVE_DOWN)
      expect(afterDownOver.currentBlockPosition.y).toBe(overState.currentBlockPosition.y + 1)
    })

    // Note: TICK and MOVE_DOWN share the same case branch and do NOT check
    // isStarted. Actions can be dispatched before the game starts. This may
    // be intentional to allow the first input to "start" the game.
    test('TICK processes even when isStarted is false', () => {
      const state = initialGameState() // isStarted: false
      const next = getNextGameState(state, GameStateAction.TICK)
      // Should still move the block down
      expect(next.currentBlockPosition.y).toBe(state.currentBlockPosition.y + 1)
    })
  })
})
