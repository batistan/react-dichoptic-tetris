interface BoardProps {
  fallingColorHex: string,
  landedColorHex: string,
  handleLineClear: () => void
}

const width = 10;
const height = 20;
const blockSideLenPx = 32 // TODO scale to display

export default function Board({ fallingColorHex, landedColorHex, handleLineClear }: BoardProps) {

  return <div className="w-full rounded-b-md rounded-l-md grid">
    game stuff
  </div>
}