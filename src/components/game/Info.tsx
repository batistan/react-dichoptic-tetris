import NextBlocks from "./NextBlocks.tsx";
import {Block} from "./logic/Blocks.ts";

interface InfoProps {
  nextBlocks: Block[],
  blockColor: string,
}

export default function Info({nextBlocks, blockColor}: InfoProps) {
  return <div className="flex flex-col align-middle w-32 bg-info rounded-r-md">
    <NextBlocks blocks={nextBlocks} color={blockColor} />
  </div>
}