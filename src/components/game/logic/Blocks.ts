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

export function rotateBlock(
  block: Block,
  direction: RotationDirection
): Block {
  return { ...block, rotation: ((block.rotation + direction) % 4) as Rotation }
}

export function randomBlock(
  randomNumberFn: () => number = Math.random
): Block {
  return { shape: blockTypes[Math.floor(randomNumberFn() * blockTypes.length)], rotation: 0 }
}

export const isRotation = (num: number): num is Rotation =>
  num >= 0 && num < 4;

// matrix of possible block types
// the "correct" way to do this is with actual rotations, modeling your block as existing in a 2d plane and computing
// the new coordinates as a rotation about the "origin" of each block, but that's a lot more work than needed
// when there's a dichoptic tetris tournament or something I'll eat these words
export const getBlockRotations = (block: Block): RotationArray => {
  switch (block.shape) {
    case 'I':
      return [
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0]
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    case 'J':
      return [
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [1, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 1, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    case 'L':
      return [
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [1, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [1, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 0, 1, 0],
          [1, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    case 'O':
      return [
        [
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [1, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    case 'S':
      return [
        [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [1, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 1, 0],
          [1, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    case 'Z':
      return [
        [
          [0, 0, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 0, 0],
          [1, 1, 0, 0],
          [1, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [1, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 0, 1, 0],
          [0, 1, 1, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    case 'T':
      return [
        [
          [0, 0, 0, 0],
          [1, 1, 1, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 0, 0],
          [1, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 0, 0],
          [1, 1, 1, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ],
        [
          [0, 1, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0]
        ]
      ][block.rotation];
    default: {
      console.warn(`Unknown block ${block}`)
      return [];
    }
  }
};
