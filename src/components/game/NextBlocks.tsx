import {Block} from "./logic/Blocks.ts";
import BlockPreview from "./BlockPreview.tsx";

export default function NextBlocks({blocks, color}: {blocks: Block[], color: string}) {
  return <div className="p-3">
    <p className="text-text-dark text-center uppercase">Next</p>
    <div className="flex flex-col overflow-hidden rounded-md">
      { blocks.map(block => {
        return <div className="py-1" key={crypto.randomUUID()}>
          <BlockPreview block={block} color={color} />
        </div>
      })
      }
    </div>
  </div>
}