import {GameState} from "./logic/GameState.ts";

interface BoardProps {
  gameState: GameState,
  fallingColorHex: string,
  landedColorHex: string,
}

export default function Board({ gameState, fallingColorHex, landedColorHex }: BoardProps) {
  const board = gameState.board

  return <div className="w-full rounded-b-md rounded-l-md grid">
    {board.rows.map((row) => {
      return <div key={row.id}>
        {row.cells.map((cell, index) => {
          const color = cell === null ? "transparent" : landedColorHex
          return <div key={`${row.id}-${index}`} style={{ backgroundColor: color }}/>
        })}
      </div>
    })}
  </div>
}