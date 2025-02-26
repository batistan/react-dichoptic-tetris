import {Block} from "./logic/Blocks.ts";
import BlockPreview from "./BlockPreview.tsx";

export default function HoldBlock({ heldBlock, color }: { heldBlock: Block | null, color: string }) {

  return <div className="flex flex-col align-middle w-32 bg-info rounded-r-md">
    <div className="bg-board py-3 rounded-md" key={crypto.randomUUID()}>
      { heldBlock && <BlockPreview block={heldBlock} color={color} /> }
  </div>
  </div>
}