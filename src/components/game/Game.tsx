import Board from "./Board.tsx";
import Info from "./Info.tsx";
import {useEffect, useReducer, useRef} from "react";
import {calculateLevel, GameStateAction, getNextGameState, initialGameState} from "./logic/GameState.ts";
import "./game.css"
import useKeyboardControls from "./useKeyboardControls.ts";
import HoldBlock from "./HoldBlock.tsx";

export default function Game({ fallingColorHex, landedColorHex }: { fallingColorHex: string; landedColorHex: string }) {
  const [gameState, dispatch] = useReducer(getNextGameState, initialGameState())
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isOver, isPaused } = gameState;

  useKeyboardControls(dispatch)

  useEffect(() => {
    if (!isOver && !isPaused) {
      intervalRef.current = setInterval(() => {
        dispatch(GameStateAction.TICK)
      }, 500)
    }

    return () => {
      if (intervalRef.current) { clearInterval(intervalRef.current) }
    }
  }, [isOver, isPaused, intervalRef])

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
          level={calculateLevel(gameState.linesCleared)}
    />
  </div>)
}