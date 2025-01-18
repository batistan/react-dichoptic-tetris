import {useState} from "react";
import ColorPickerWithSwatches from "./ColorPickerWithSwatches.tsx";
import {blueSwatches, redSwatches} from "../../swatches.ts";
import "./ColorSelection.css"

type HexColor = string;

interface ColorSelectionProps {
  fallingColor: HexColor;
  landedColor: HexColor;
  handleFallingColorChange: (s: HexColor) => void;
  handleLandedColorChange: (s: HexColor) => void;
}

export default function ColorSelection({ fallingColor, landedColor, handleFallingColorChange, handleLandedColorChange }: ColorSelectionProps) {
  const [fallingColorOnLeft, setFallingColorOnLeft] = useState(true);

  const leftSwatches = fallingColorOnLeft ? redSwatches : blueSwatches
  const rightSwatches = fallingColorOnLeft ? blueSwatches : redSwatches

  function handleSwap() {
    setFallingColorOnLeft(prev => !prev)
    handleFallingColorChange(landedColor)
    handleLandedColorChange(fallingColor)
  }

  return <div className="color-selection">
    <div className="flex justify-between">
      <div className="flex-col">
        <p>Falling Block Color</p>
        <ColorPickerWithSwatches
          color={fallingColor}
          swatches={leftSwatches}
          onChangeColor={handleFallingColorChange}
        />
      </div>
      <div className="flex-col">
        <p>Landed Block Color</p>
        <ColorPickerWithSwatches
          color={landedColor}
          onChangeColor={handleLandedColorChange}
          swatches={rightSwatches}
        />
      </div>
    </div>
    <button
      className="bg-sky-200 text-sky-900 rounded-md w-fit px-2 hover:bg-sky-300"
      onClick={handleSwap}>
      ⇔ Swap
    </button>
  </div>
}