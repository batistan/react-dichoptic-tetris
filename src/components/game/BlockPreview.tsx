import {Block, getRotationArray} from "./logic/Blocks.ts";

export default function BlockPreview({ block, color }: { block: Block | null, color: string }) {
  const rotationArray = getRotationArray(block ?? { shape: "ghost", rotation: 0 });

  return <div className="px-3" key={crypto.randomUUID()}>
    { rotationArray && rotationArray.map((row) => {
      return <div className="flex flex-row justify-center" key={crypto.randomUUID()}>
        {
          row.map((cell) => {
            const cellCol = cell === 1 ? color : "transparent"
            return <div className="cell" key={crypto.randomUUID()} style={{ backgroundColor: cellCol }} />
          })
        }
      </div>
    }) }
  </div>
}
