import { describe, test, expect, beforeEach } from 'vitest'
import {
  blockTypes,
  rotateBlock,
  getRotationArray,
  RandomBlockGenerator,
  RotationDirection,
  Rotation,
} from '../src/components/game/logic/Blocks.ts'
import { resetBlockGenerator, block, orderedGenerator } from './helpers.ts'

beforeEach(() => {
  resetBlockGenerator()
})

describe('rotateBlock', () => {
  test('clockwise rotation increments rotation by 1', () => {
    const result = rotateBlock(block('T', 0), RotationDirection.CLOCKWISE)
    expect(result.rotation).toBe(1)
  })

  test('anti-clockwise rotation decrements rotation (wraps via mod)', () => {
    const result = rotateBlock(block('T', 0), RotationDirection.ANTI_CLOCKWISE)
    expect(result.rotation).toBe(3)
  })

  test('clockwise from rotation 3 wraps to 0', () => {
    const result = rotateBlock(block('T', 3), RotationDirection.CLOCKWISE)
    expect(result.rotation).toBe(0)
  })

  test('anti-clockwise from rotation 1 goes to 0', () => {
    const result = rotateBlock(block('T', 1), RotationDirection.ANTI_CLOCKWISE)
    expect(result.rotation).toBe(0)
  })

  test('four clockwise rotations return to original rotation', () => {
    let b = block('T', 0)
    for (let i = 0; i < 4; i++) {
      b = rotateBlock(b, RotationDirection.CLOCKWISE)
    }
    expect(b.rotation).toBe(0)
  })

  test('does not mutate the original block', () => {
    const original = block('T', 0)
    rotateBlock(original, RotationDirection.CLOCKWISE)
    expect(original.rotation).toBe(0)
  })

  test('preserves shape when rotating', () => {
    const result = rotateBlock(block('I', 2), RotationDirection.CLOCKWISE)
    expect(result.shape).toBe('I')
    expect(result.rotation).toBe(3)
  })
})

describe('getRotationArray', () => {
  test('returns a 4x4 number[][] for each block type at rotation 0', () => {
    for (const shape of blockTypes) {
      const arr = getRotationArray(block(shape, 0))
      expect(arr).toHaveLength(4)
      for (const row of arr) {
        expect(row).toHaveLength(4)
      }
    }
  })

  test('returns a 4x4 number[][] for all 4 rotations of every block type', () => {
    for (const shape of blockTypes) {
      for (let r = 0; r < 4; r++) {
        const arr = getRotationArray(block(shape, r as Rotation))
        expect(arr).toHaveLength(4)
        for (const row of arr) {
          expect(row).toHaveLength(4)
        }
      }
    }
  })

  test('T-piece rotation 0 matches expected shape', () => {
    const arr = getRotationArray(block('T', 0))
    expect(arr).toEqual([
      [0, 0, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ])
  })

  test('I-piece rotation 0 has 4 cells in a horizontal line', () => {
    const arr = getRotationArray(block('I', 0))
    // row 2 should be all 1s
    expect(arr[2]).toEqual([1, 1, 1, 1])
    // other rows should be all 0s
    expect(arr[0]).toEqual([0, 0, 0, 0])
    expect(arr[1]).toEqual([0, 0, 0, 0])
    expect(arr[3]).toEqual([0, 0, 0, 0])
  })

  test('O-piece all 4 rotations are identical', () => {
    const r0 = getRotationArray(block('O', 0))
    const r1 = getRotationArray(block('O', 1))
    const r2 = getRotationArray(block('O', 2))
    const r3 = getRotationArray(block('O', 3))
    expect(r0).toEqual(r1)
    expect(r1).toEqual(r2)
    expect(r2).toEqual(r3)
  })

  // BUG: I-piece rotations 0 and 2 are identical, meaning a 180-degree rotation
  // is a no-op. Standard SRS Tetris has distinct rotation states for all 4 orientations.
  // The same applies to S-piece and Z-piece below.
  test('I-piece rotation 0 and 2 are identical (BUG: should differ per SRS)', () => {
    const r0 = getRotationArray(block('I', 0))
    const r2 = getRotationArray(block('I', 2))
    expect(r0).toEqual(r2)
  })

  test('S-piece rotation 0 and 2 are identical (BUG: should differ per SRS)', () => {
    const r0 = getRotationArray(block('S', 0))
    const r2 = getRotationArray(block('S', 2))
    expect(r0).toEqual(r2)
  })

  test('Z-piece rotation 0 and 2 are identical (BUG: should differ per SRS)', () => {
    const r0 = getRotationArray(block('Z', 0))
    const r2 = getRotationArray(block('Z', 2))
    expect(r0).toEqual(r2)
  })

  // The default case in getRotationArray returns a valid 4x4 empty matrix for unknown types.
  // This silently produces an empty block rather than throwing an error, which could mask
  // bugs if an invalid BlockType is somehow introduced.
  test('invalid BlockType returns an empty 4x4 matrix (no error thrown)', () => {
    const arr = getRotationArray({ shape: 'X' as any, rotation: 0 })
    expect(arr).toHaveLength(4)
    for (const row of arr) {
      expect(row).toEqual([0, 0, 0, 0])
    }
    // No cells are filled — the block is invisible
    expect(arr.flat().filter(v => v === 1).length).toBe(0)
  })

  test('each block type has exactly 4 filled cells at rotation 0 (except I which has 4)', () => {
    for (const shape of blockTypes) {
      const arr = getRotationArray(block(shape, 0))
      const filledCount = arr.flat().filter(v => v === 1).length
      expect(filledCount).toBe(4)
    }
  })
})

describe('RandomBlockGenerator', () => {
  test('getNextBlock returns a Block with shape in blockTypes and rotation 0', () => {
    const gen = new RandomBlockGenerator()
    const b = gen.getNextBlock()
    expect(blockTypes).toContain(b.shape)
    expect(b.rotation).toBe(0)
  })

  test('getNextBlocks(n) returns n blocks', () => {
    const gen = new RandomBlockGenerator()
    const blocks = gen.getNextBlocks(5)
    expect(blocks).toHaveLength(5)
  })

  test('a full permutation of 7 blocks contains all 7 block types exactly once', () => {
    const gen = new RandomBlockGenerator()
    const blocks = gen.getNextBlocks(7)
    const shapes = blocks.map(b => b.shape).sort()
    expect(shapes).toEqual([...blockTypes].sort())
  })

  test('after exhausting one permutation, a new one is generated', () => {
    const gen = new RandomBlockGenerator()
    const first7 = gen.getNextBlocks(7)
    const next7 = gen.getNextBlocks(7)

    // Both should be complete permutations
    const shapes1 = first7.map(b => b.shape).sort()
    const shapes2 = next7.map(b => b.shape).sort()
    expect(shapes1).toEqual([...blockTypes].sort())
    expect(shapes2).toEqual([...blockTypes].sort())
  })

  test('constructor with custom getPermutation uses provided function', () => {
    const fixedOrder: Rotation = 0
    const customBlocks = [block('T', fixedOrder), block('I', fixedOrder)]
    const gen = new RandomBlockGenerator(() => [...customBlocks])

    expect(gen.getNextBlock().shape).toBe('T')
    expect(gen.getNextBlock().shape).toBe('I')
  })

  test('getPermutation returning empty array throws on getNextBlock', () => {
    const gen = new RandomBlockGenerator(() => [])
    expect(() => gen.getNextBlock()).toThrow('getPermutation must return a non-empty array')
  })

  test('getInstance returns a singleton', () => {
    const a = RandomBlockGenerator.getInstance()
    const b = RandomBlockGenerator.getInstance()
    expect(a).toBe(b)
  })

  test('getInstance after reset returns a new instance', () => {
    const a = RandomBlockGenerator.getInstance()
    resetBlockGenerator()
    const b = RandomBlockGenerator.getInstance()
    expect(a).not.toBe(b)
  })
})
