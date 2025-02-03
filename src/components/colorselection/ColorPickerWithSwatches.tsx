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
    <div>
      {swatches.map((swatch) => {
        return <button
          key={JSON.stringify(swatch)}
          onClick={() => handleSwatchSelect(swatch)}
          style={{background: swatch}}
        />
      })}
    </div>
    <div className="flex flex-row gap-2">
      <div style={{background: color}}/><p>{color}</p>
    </div>
  </div>
}