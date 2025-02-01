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

  return <div className="flex-row">
    <NextBlocks blocks={nextBlocks} color={blockColor} />
    <div className="bg-gray-300 w-1/3 h-2/3 flex flex-col contain-content justify-center rounded-r-md">
    <InfoBox label={"Level"} value={level} />
    <InfoBox label={"Score"} value={score} />
    {/*<InfoBox label={"High Score"} value={hiScore} />*/}
  </div>
  </div>
}