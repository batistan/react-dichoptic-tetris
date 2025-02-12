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

  return <div className="flex flex-col order-1 md:-order-1 w-1/3">
    <div className="flex flex-col md:flex-row justify-around gap-2">
      <div className="flex flex-col">
        <p>Falling Block Color</p>
        <ColorPickerWithSwatches
          color={fallingColor}
          swatches={leftSwatches}
          onChangeColor={handleFallingColorChange}
        />
      </div>
      <div>
        <p>Landed Block Color</p>
        <ColorPickerWithSwatches
          color={landedColor}
          onChangeColor={handleLandedColorChange}
          swatches={rightSwatches}
        />
      </div>
    </div>
    <button
      onClick={handleSwap}>
      ⇔ Swap
    </button>
  </div>
}