import {Block, getRotationArray} from "./logic/Blocks.ts";

export default function HoldBlock({ heldBlock, color }: { heldBlock: Block | null, color: string }) {
  const rotationArray = heldBlock ? getRotationArray(heldBlock) : null;

  return <div className="flex flex-col align-middle w-32 bg-info rounded-r-md">
    <div className="bg-board py-3 rounded-md" key={crypto.randomUUID()}>
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
  </div>
}