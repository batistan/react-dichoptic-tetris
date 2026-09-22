import {Block, blockTypes, RandomBlockGenerator} from "../src/components/game/logic/Blocks.ts";

const sortedShapes = (blocks: Block[]) => blocks.map(block => block.shape).sort()

describe("RandomBlockGenerator with the default permutation", () => {
  test('deals every shape exactly once per bag, with default rotation', () => {
    const blocks = new RandomBlockGenerator().getNextBlocks(blockTypes.length)

    expect(sortedShapes(blocks)).toEqual([...blockTypes].sort())
    blocks.forEach(block => expect(block.rotation).toBe(0))
  })
  test('deals a full new bag once the first is exhausted', () => {
    const generator = new RandomBlockGenerator()
    generator.getNextBlocks(blockTypes.length)

    const secondBag = generator.getNextBlocks(blockTypes.length)

    expect(sortedShapes(secondBag)).toEqual([...blockTypes].sort())
  })
})

describe("RandomBlockGenerator with an injected permutation", () => {
  const bag: Block[] = [{shape: 'I', rotation: 0}, {shape: 'T', rotation: 0}]

  test('deals blocks in permutation order', () => {
    const generator = new RandomBlockGenerator(() => [...bag])

    expect(generator.getNextBlock()).toEqual(bag[0])
    expect(generator.getNextBlock()).toEqual(bag[1])
  })
  test('getNextBlocks continues across a bag boundary', () => {
    const generator = new RandomBlockGenerator(() => [...bag])

    expect(generator.getNextBlocks(3)).toEqual([bag[0], bag[1], bag[0]])
  })
  test('throws when the permutation is empty', () => {
    const generator = new RandomBlockGenerator(() => [])

    expect(() => generator.getNextBlock()).toThrow("getPermutation must return a non-empty array")
  })
})
