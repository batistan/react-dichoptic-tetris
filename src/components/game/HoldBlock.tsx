import {Block} from "./logic/Blocks.ts";
import BlockPreview from "./BlockPreview.tsx";
import InfoBox from "./InfoBox.tsx";

interface HoldBlockProps {
  heldBlock: Block | null,
  color: string,
  level: number,
  score: number,
  hiScore: number
}

export default function HoldBlock({ heldBlock, color, level, score, hiScore }: HoldBlockProps) {
  return <div className="flex flex-col align-middle w-32 bg-info rounded-l-md p-3 h-1/4">
    <p className="text-center font-mono uppercase text-gray-700">Held</p>
    <div className="bg-board py-3 rounded-md">
      <BlockPreview block={heldBlock} color={color} />
    </div>
    <div>
      <InfoBox label={"Level"} value={level} />
      <InfoBox label={"Score"} value={score} />
      <InfoBox label={"High Score"} value={hiScore} />
    </div>
  </div>
}