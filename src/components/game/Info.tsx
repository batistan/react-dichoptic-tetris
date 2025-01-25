import InfoBox from "./InfoBox.tsx";
import NextBlock from "./NextBlock.tsx";

interface InfoProps {
  nextBlock: string,
  blockColor: string,
  score: number,
  level: number,
}

export default function Info({nextBlock, blockColor, score, level}: InfoProps) {
  return <div>
    <NextBlock block={nextBlock} color={blockColor} />
    <InfoBox label={"Level"} value={level} />
    <InfoBox label={"Score"} value={score} />
    {/*<InfoBox label={"High Score"} value={hiScore} />*/}
  </div>
}