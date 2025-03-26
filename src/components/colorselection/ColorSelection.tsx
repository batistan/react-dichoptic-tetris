import {ReactNode, useContext, useState} from "react";
import ColorPickerWithSwatches from "./ColorPickerWithSwatches.tsx";
import {blueSwatches, redSwatches} from "../../swatches.ts";
import "./ColorSelection.css"
import SwapButton from "./SwapButton.tsx";
import {settingsContext} from "../SettingsContext.ts";

type HexColor = string;

interface ColorSelectionProps {
  handleFallingColorChange: (s: HexColor) => void;
  handleLandedColorChange: (s: HexColor) => void;
}

export default function ColorSelection({ handleFallingColorChange, handleLandedColorChange }: ColorSelectionProps) {
  const [fallingColorOnLeft, setFallingColorOnLeft] = useState(true);

  const { fallingColorHex: fallingColor, landedColorHex: landedColor } = useContext(settingsContext)

  const leftSwatches = fallingColorOnLeft ? redSwatches : blueSwatches
  const rightSwatches = fallingColorOnLeft ? blueSwatches : redSwatches

  function handleSwap() {
    setFallingColorOnLeft(prev => !prev)
    handleFallingColorChange(landedColor)
    handleLandedColorChange(fallingColor)
  }

  return <div className="flex flex-col justify-center gap-4 order-1 md:-order-1">
    <ColorPickContainer>
      <span className="text-lg pb-2">Falling Block Color</span>
      <ColorPickerWithSwatches
        color={fallingColor}
        swatches={leftSwatches}
        onChangeColor={handleFallingColorChange}
      />
    </ColorPickContainer>
    <SwapButton handleSwap={handleSwap} />
    <ColorPickContainer>
      <span className="text-lg pb-2">Landed Block Color</span>
      <ColorPickerWithSwatches
        color={landedColor}
        onChangeColor={handleLandedColorChange}
        swatches={rightSwatches}
      />
    </ColorPickContainer>
  </div>
}

function ColorPickContainer({ children }: { children: ReactNode }) {
  return <div className="flex flex-col text-text-dark bg-info-bg p-4 rounded-md shadow-lg">
    {children}
  </div>

}
