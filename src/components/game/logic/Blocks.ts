export const blockTypes: string[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
export type BlockType = typeof blockTypes[number];
export type Block = {
  shape: BlockType;
  rotation: Rotation
}

export type Rotation = 0 | 1 | 2 | 3;
export enum RotationDirection {
  CLOCKWISE = 1,
  ANTI_CLOCKWISE = -1
}
export type RotationArray = number[][]

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export function rotateBlock(
  block: Block,
  direction: RotationDirection
): Block {
  return { ...block, rotation: mod(block.rotation + direction, 4) as Rotation }
}

export class RandomBlockGenerator {
  private currentPermutation: Block[]
  private readonly getPermutation: () => Block[]

  private static instance: RandomBlockGenerator | null = null

  constructor(getPermutation: () => Block[] = generateBlocksPermutation) {
    this.currentPermutation = getPermutation()
    this.getPermutation = getPermutation
  }

  static getInstance(): RandomBlockGenerator {
    if (RandomBlockGenerator.instance !== null) {
      return RandomBlockGenerator.instance
    } else {
      RandomBlockGenerator.instance = new RandomBlockGenerator()
      return RandomBlockGenerator.instance
    }
  }

  private newPermutation(): void {
    this.currentPermutation = this.getPermutation()
    if (this.currentPermutation.length < 1) {
      throw new Error(`getPermutation must return a non-empty array`)
    }
  }

  getNextBlock(): Block {
    if (this.currentPermutation.length < 1) {
      this.newPermutation()
    }

    // @ts-expect-error newPermutation() will throw an error if currentPermutation is still empty
    return this.currentPermutation.shift()
  }

  getNextBlocks(num: number): Block[] {
    return Array(num).fill(0).map(() => {
      return this.getNextBlock()
    })
  }
}

function generateBlocksPermutation(): Block[] {
  const permutation = Array(blockTypes.length)
    .fill(0)
    .map((_, i) => {
      return { shape: blockTypes[i], rotation: 0 as Rotation }
    }) // generate array populated with values

  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  for (let i = permutation.length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    [ permutation[i - 1], permutation[randomIndex] ] = [ permutation[randomIndex], permutation[i - 1] ];
  }

  return permutation
}

// matrix of possible block types
// the "correct" way to do this is with actual rotations, modeling your block as existing in a 2d plane and computing
// the new coordinates as a rotation about the "origin" of each block, but that's a lot more work than needed
// when there's a dichoptic tetris tournament or something I'll eat these words
export const getRotationArray = (block: Block): RotationArray => {
  switch (block.shape) {
    case 'I':
      return [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ]
      ][block.rotation];
    case 'J':
      return [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 1, 1, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 0, 1, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [1, 1, 0, 0]
        ],
      ][block.rotation];
    case 'L':
      return [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 1, 0],
          [1, 1, 1, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 1, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [1, 0, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ]
      ][block.rotation];
    case 'O':
      return [
        [
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    case 'S':
      return [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [1, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 0, 0]
        ]
      ][block.rotation];
    case 'Z':
      return [
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 1, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [1, 1, 0, 0],
          [1, 0, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 1, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [1, 1, 0, 0],
          [1, 0, 0, 0]
        ]
      ][block.rotation];
    case 'T':
      return [
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [1, 1, 1, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 0, 0]
        ]
      ][block.rotation];
    default: {
      return [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
    }
  }
};
