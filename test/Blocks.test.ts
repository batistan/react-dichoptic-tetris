import {randomBlockType, Rotation} from "../src/components/game/logic/Blocks.ts";

describe("randomBlockType returns a random block with default rotation", () => {
  test('default rotation', async () => {
    const result = randomBlockType(() => 0);
    expect(result.rotation).toBe(0 as Rotation)
  })
  test('gets type according to RNG input', async () => {
    const resultA = randomBlockType(() => 0);
    const resultB = randomBlockType(() => 5);

    expect(resultA.shape === resultB.shape).toBeFalsy()
  })
})