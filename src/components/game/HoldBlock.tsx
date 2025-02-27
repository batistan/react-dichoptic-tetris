import {Block} from "./logic/Blocks.ts";
import BlockPreview from "./BlockPreview.tsx";

export default function HoldBlock({ heldBlock, color }: { heldBlock: Block | null, color: string }) {
  return <div className="flex flex-col align-middle w-32 bg-info rounded-l-md p-3 h-1/4">
    <p className="text-center font-mono uppercase text-gray-700">Held</p>
    <div className="bg-board py-3 rounded-md">
      <BlockPreview block={heldBlock} color={color} />
    </div>
  </div>
}