import {randomBlock, Rotation} from "../src/components/game/logic/Blocks.ts";

describe("randomBlockType returns a random block with default rotation", () => {
  test('default rotation', async () => {
    const result = randomBlock(() => 0);
    expect(result.rotation).toBe(0 as Rotation)
  })
  test('gets type according to RNG input', async () => {
    const resultA = randomBlock(() => 0);
    const resultB = randomBlock(() => 5);

    expect(resultA.shape === resultB.shape).toBeFalsy()
  })
})