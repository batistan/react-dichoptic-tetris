import {Block, getRotationArray} from "./logic/Blocks.ts";

export default function NextBlocks({blocks, color}: {blocks: Block[], color: string}) {
  return <div className="border-indigo-50 p-3 flex-col justify-center">
    <p className="text-center font-mono uppercase text-gray-700">Next</p>
    <div className="bg-gray-500 rounded-md p-2">
      { blocks.map(block => {
        const rotationArray = getRotationArray(block);
        return <div>
          { rotationArray.map((row) => {
            return row.map((cell) => {
              const cellCol = cell === 1 ? color : "#CCCCCC"
              return <div style={{ backgroundColor: cellCol }} />
            })
          }) }
        </div>
      })
      }
    </div>
  </div>
}