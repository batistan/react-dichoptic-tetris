import {useState} from "react";
import ColorPickerWithSwatches from "./ColorPickerWithSwatches.tsx";
import {blueSwatches, redSwatches} from "../../swatches.ts";
import "./ColorSelection.css"
import SwapButton from "./SwapButton.tsx";

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

  return <div className="flex flex-col justify-center gap-4 order-1 md:-order-1">
    <div className="flex flex-col">
      <span>Falling Block Color</span>
      <ColorPickerWithSwatches
        color={fallingColor}
        swatches={leftSwatches}
        onChangeColor={handleFallingColorChange}
      />
    </div>
    <SwapButton handleSwap={handleSwap} />
    <div className="flex flex-col">
      <span>Landed Block Color</span>
      <ColorPickerWithSwatches
        color={landedColor}
        onChangeColor={handleLandedColorChange}
        swatches={rightSwatches}
      />
    </div>
  </div>
}
