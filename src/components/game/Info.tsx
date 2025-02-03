import InfoBox from "./InfoBox.tsx";
import NextBlocks from "./NextBlocks.tsx";
import {Block} from "./logic/Blocks.ts";

interface InfoProps {
  nextBlocks: Block[],
  blockColor: string,
  score: number,
  level: number,
}

export default function Info({nextBlocks, blockColor, score, level}: InfoProps) {

  return <div className="flex flex-col w-32 bg-board rounded-r-md">
    <NextBlocks blocks={nextBlocks} color={blockColor} />
    <div>
      <InfoBox label={"Level"} value={level} />
      <InfoBox label={"Score"} value={score} />
      {/*<InfoBox label={"High Score"} value={hiScore} />*/}
    </div>
  </div>
}