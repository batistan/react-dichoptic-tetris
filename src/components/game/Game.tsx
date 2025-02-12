import Board from "./Board.tsx";
import Info from "./Info.tsx";
import {useEffect, useReducer} from "react";
import {calculateLevel, GameStateAction, getNextGameState, initialGameState} from "./logic/GameState.ts";
import "./game.css"

export default function Game({ fallingColorHex, landedColorHex }: { fallingColorHex: string; landedColorHex: string }) {
  const [gameState, dispatch] = useReducer(getNextGameState, initialGameState())

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(GameStateAction.TICK)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (<div id="game">
    <Board gameState={gameState}
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