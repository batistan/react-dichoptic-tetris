import Board from "./Board.tsx";
import Info from "./Info.tsx";
import {useContext, useEffect, useReducer, useRef} from "react";
import {calculateLevel, GameStateAction, getNextGameState, initialGameState} from "./logic/GameState.ts";
import "./game.css"
import useKeyboardControls from "./useKeyboardControls.ts";
import HoldBlock from "./HoldBlock.tsx";
import {settingsContext} from "../SettingsContext.ts";

const TARGET_FPS: number = 60;
// https://listfist.com/list-of-tetris-levels-by-speed-nes-ntsc-vs-pal
// not one to one, but a decent approximation
const FRAMES_PER_TICK_PER_LEVEL = 48;
const HIGH_SCORE_KEY = "highScore";
const HIGH_SCORE = (localStorage && localStorage.getItem(HIGH_SCORE_KEY)) ?? "0";

export default function Game() {
  const { fallingColorHex } = useContext(settingsContext);

  const [gameState, dispatch] = useReducer(getNextGameState, initialGameState())
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isOver, isPaused, linesCleared } = gameState;

  const level = calculateLevel(linesCleared)

  useKeyboardControls(dispatch)

  useEffect(() => {
    if (!isOver && !isPaused) {
      const millisPerTick = (Math.floor(FRAMES_PER_TICK_PER_LEVEL / level) / TARGET_FPS) * 1000
      intervalRef.current = setInterval(() => {
        dispatch(GameStateAction.TICK)
      }, millisPerTick)
    }

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current) }
    }
  }, [isOver, isPaused, level, intervalRef])

  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, Math.max(gameState.score, +HIGH_SCORE).toString())
  }, [isOver]);

  return (<div className="flex flex-row justify-start drop-shadow-md shadow-background">
    <HoldBlock heldBlock={gameState.heldBlock}
               color={fallingColorHex}
               score={gameState.score}
               hiScore={+HIGH_SCORE}
               level={level}
    />
    <Board gameState={gameState}
           handleRestart={() => dispatch(GameStateAction.RESTART)}
    />
    <Info blockColor={fallingColorHex}
          nextBlocks={gameState.nextBlocks.slice(1)}
    />
  </div>)
}
