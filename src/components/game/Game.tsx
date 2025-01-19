import Board from "./Board.tsx";
import Info from "./Info.tsx";
import {useReducer} from "react";
import {calculateLevel, getNextGameState, initialGameState} from "./logic/GameState.ts";
import "./game.css"

export default function Game({ fallingColorHex, landedColorHex }: { fallingColorHex: string; landedColorHex: string }) {
  const [gameState, dispatch] = useReducer(getNextGameState, initialGameState())

  console.log(`Game state ${JSON.stringify(gameState, null, 2)}`)

  return (<div id="game">
    <Board gameState={gameState}
           fallingColorHex={fallingColorHex}
           landedColorHex={landedColorHex}
    />
    <Info blockColor={fallingColorHex}
          nextBlocks={gameState.nextBlocks}
          score={gameState.score}
          level={calculateLevel(gameState.linesCleared)}
    />
  </div>)
}