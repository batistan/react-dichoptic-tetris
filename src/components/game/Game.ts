import {Board, Coordinates} from "./logic/Board.ts";
import {Block} from "./logic/Blocks.ts";

export enum Status {
  NOT_STARTED = "NOT_STARTED",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  ENDED = "ENDED"
}

export type GameState = {
  state: Status;
  board: Board;
  currentBlock: Block;
  currentBlockCoords: Coordinates;
  heldBlock: Block | null;
  nextBlock: Block
  points: number;
  lines: number;
};

export type UpdateAction =
  "PAUSE" |
  "RESUME" |
  "RESTART" |
  "TICK" |
  "MOVE_DOWN" |
  "MOVE_LEFT" |
  "MOVE_RIGHT" |
  "HARD_DROP" |
  "ROTATE_CLOCKWISE" |
  "ROTATE_ANTI_CLOCKWISE" |
  "HOLD"

export function updateGameState(prevState: GameState, action: UpdateAction): GameState {
  switch (action) {
    case "TICK":
      if (prevState.state !== Status.PLAYING) { return prevState }

      const newState = tryMovePiece(DOWN, prevState.currentBlock)
  }
}

const initialGameState: GameState = {
  board: new Board(),
  status: Status.NOT_STARTED,
  currentBlock: "",
  currentBlockCoords: { x: 0, y: 0 },
  heldBlock: ,
  lines: 0,
  nextBlock: "",
  points: 0,
}
