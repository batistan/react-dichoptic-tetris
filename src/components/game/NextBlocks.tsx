import {Block, getRotationArray} from "./logic/Blocks.ts";

export default function NextBlocks({blocks, color}: {blocks: Block[], color: string}) {
  return <div className="p-3">
    <p className="text-center font-mono uppercase text-gray-700">Next</p>
    <div className="flex flex-col gap-5">
      { blocks.map(block => {
        const rotationArray = getRotationArray(block);
        return <div className="bg-board py-3 rounded-md" key={crypto.randomUUID()}>
          { rotationArray.map((row) => {
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
      })
      }
    </div>
  </div>
}