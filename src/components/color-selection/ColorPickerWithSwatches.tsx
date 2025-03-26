import {HexColorPicker} from "react-colorful";

interface ColorPickerProps {
  color: string,
  onChangeColor: (color: string) => void,
  swatches: string[]
}

export default function ColorPickerWithSwatches({color, onChangeColor, swatches}: ColorPickerProps) {

  function handleSwatchSelect(color: string) {
    onChangeColor(color)
  }

  return <div>
    <HexColorPicker color={color} onChange={onChangeColor} />
    <div className="flex flex-row flex-wrap">
      {swatches.map((swatch) => {
        return <button
          key={JSON.stringify(swatch)}
          onClick={() => handleSwatchSelect(swatch)}
          className="aspect-square w-1/12 m-1 rounded-sm"
          style={{background: swatch}}
        />
      })}
    </div>
  </div>
}