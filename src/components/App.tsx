import { useState } from 'react'
import '../App.css'
import {blueSwatches, redSwatches} from "../swatches.ts";
import Game from "./game/Game.tsx";
import ColorSelection from "./colorselection/ColorSelection.tsx";

function App() {
  const [fallingColor, setFallingColor] = useState<string>(redSwatches[redSwatches.length / 2])
  const [landedColor, setLandedColor] = useState<string>(blueSwatches[blueSwatches.length / 2])

  return (
    <div className="mx-1 h-full flex gap-2 items-center justify-between border-2 border-indigo-50">
      <ColorSelection
        fallingColor={fallingColor}
        landedColor={landedColor}
        handleFallingColorChange={setFallingColor}
        handleLandedColorChange={setLandedColor}
      />
      <Game fallingColorHex={fallingColor} landedColorHex={landedColor} />
    </div>
  )
}

export default App
