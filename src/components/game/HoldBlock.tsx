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
  return <div className="hidden md:flex flex-col align-middle w-32 rounded-l-md p-3 h-fit bg-info-bg">
    <p className="text-text-dark text-center uppercase">Held</p>
    <div className="m-1 p-2 bg-board-bg rounded-md overflow-hidden">
      <BlockPreview block={heldBlock} color={color} />
    </div>
    <div>
      <InfoBox label={"Level"} value={level} />
      <InfoBox label={"Score"} value={score} />
      <InfoBox label={"High Score"} value={hiScore} />
    </div>
  </div>
}