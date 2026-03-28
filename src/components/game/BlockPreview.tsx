import {Block, getRotationArray} from "./logic/Blocks.ts";

export default function BlockPreview({ block, color }: { block: Block | null, color: string }) {
  const rotationArray = getRotationArray(block ?? { shape: "ghost", rotation: 0 });

  return <div>
    { rotationArray && rotationArray.map((row, rowIndex) => {
      return <div className="flex flex-row justify-center bg-board-bg overflow-hidden" key={`row-${rowIndex}`}>
        {
          row.map((cell, colIndex) => {
            const cellCol = cell === 1 ? color : "transparent"
            return <div className="cell" key={`cell-${rowIndex}-${colIndex}`} style={{ backgroundColor: cellCol }} />
          })
        }
      </div>
    }) }
  </div>
}
