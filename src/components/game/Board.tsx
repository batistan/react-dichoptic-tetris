import {useReducer} from "react";
import {getNextGameState, initialGameState} from "./logic/GameState.ts";

interface BoardProps {
  fallingColorHex: string,
  landedColorHex: string,
  handleLineClear: () => void
}

export default function Board({ fallingColorHex, landedColorHex }: BoardProps) {
  const [gameState, dispatch] = useReducer(getNextGameState, initialGameState())

  const board = gameState.board
  return <div className="w-full rounded-b-md rounded-l-md grid">
    {board.rows.map((row) => {
      return <div key={row.id}>
        {row.cells.map((cell, index) => {
          const color = cell === null ? "#CCCCCC" : landedColorHex
          return <div key={`${row.id}-${index}`} style={{ backgroundColor: color }}/>
        })}
      </div>
    })}
  </div>
}