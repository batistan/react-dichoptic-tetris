import Board from "./Board.tsx";
import Info from "./Info.tsx";
import {useEffect, useReducer, useRef} from "react";
import {calculateLevel, GameStateAction, getNextGameState, initialGameState} from "./logic/GameState.ts";
import "./game.css"
import useKeyboardControls from "./useKeyboardControls.ts";
import HoldBlock from "./HoldBlock.tsx";

const TARGET_FPS: number = 60;

export default function Game({ fallingColorHex, landedColorHex }: { fallingColorHex: string; landedColorHex: string }) {
  const [gameState, dispatch] = useReducer(getNextGameState, initialGameState())
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isOver, isPaused, linesCleared } = gameState;

  const level = calculateLevel(linesCleared)

  useKeyboardControls(dispatch)

  useEffect(() => {
    if (!isOver && !isPaused) {
      const millisPerTick = (Math.floor(48 / level) / TARGET_FPS) * 1000
      intervalRef.current = setInterval(() => {
        dispatch(GameStateAction.TICK)
      }, millisPerTick)
    }

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current) }
    }
  }, [isOver, isPaused, level, intervalRef])

  return (<div className="flex flex-row justify-start">
    <HoldBlock heldBlock={gameState.heldBlock} color={fallingColorHex} />
    <Board
      gameState={gameState}
      fallingColorHex={fallingColorHex}
      landedColorHex={landedColorHex}
    />
    <Info blockColor={fallingColorHex}
          nextBlocks={gameState.nextBlocks.slice(1)}
          score={gameState.score}
          level={level}
    />
  </div>)
}