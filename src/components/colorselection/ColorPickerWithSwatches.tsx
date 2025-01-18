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

  return <div className="flex-col gap-2">
    <HexColorPicker color={color} onChange={onChangeColor} />
    <div className="my-1 h-10 flex justify-between gap-1 flex-wrap">
      {swatches.map((swatch) => {
        return <button
          className="w-1/6 h-1/2 rounded-md"
          key={JSON.stringify(swatch)}
          onClick={() => handleSwatchSelect(swatch)}
          style={{background: swatch}}
        />
      })}
    </div>
    <div className={"flex my-2 gap-2 align-middle justify-center uppercase"}>
      <div className="w-1/5" style={{background: color}}/><p>{color}</p>
    </div>
  </div>
}