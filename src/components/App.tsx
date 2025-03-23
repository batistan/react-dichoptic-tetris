import { useState } from 'react'
import "./app.css"
import {blueSwatches, redSwatches} from "../swatches.ts";
import Game from "./game/Game.tsx";
import ColorSelection from "./colorselection/ColorSelection.tsx";
import {Header} from "./Header.tsx";

const containerClasses = [
  "flex",
  "items-center",
  "gap-2",
  "mt-4",
  "flex-col",
  "md:flex-row",
  "md:align-middle",
  "md:justify-around",
].join(' ');

function App() {
  const [fallingColor, setFallingColor] = useState<string>(redSwatches[redSwatches.length / 2])
  const [landedColor, setLandedColor] = useState<string>(blueSwatches[blueSwatches.length / 2])

  return (
    <div className="h-full box-border bg-background text-text">
      <Header />
      <div className={containerClasses}>
        <ColorSelection
          fallingColor={fallingColor}
          landedColor={landedColor}
          handleFallingColorChange={setFallingColor}
          handleLandedColorChange={setLandedColor}
        />
        <Game fallingColorHex={fallingColor} landedColorHex={landedColor} />
      </div>
    </div>
  )
}

export default App
