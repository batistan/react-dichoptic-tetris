import { useState } from 'react'
import '../styles/App.css'
import {blueSwatches, redSwatches} from "../swatches.ts";
import Game from "./game/Game.tsx";
import ColorSelection from "./colorselection/ColorSelection.tsx";
import {Header} from "./Header.tsx";

function App() {
  const [fallingColor, setFallingColor] = useState<string>(redSwatches[redSwatches.length / 2])
  const [landedColor, setLandedColor] = useState<string>(blueSwatches[blueSwatches.length / 2])

  return (
    <>
      <Header />
      <div className="bg-background text-text h-full flex gap-2 flex-col md:flex-row md:align-middle items-center border-2">
        <ColorSelection
          fallingColor={fallingColor}
          landedColor={landedColor}
          handleFallingColorChange={setFallingColor}
          handleLandedColorChange={setLandedColor}
        />
        <Game fallingColorHex={fallingColor} landedColorHex={landedColor} />
      </div>
    </>
  )
}

export default App
