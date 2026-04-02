import {HexColorPicker} from "react-colorful";
import {useRef} from "react";

interface ColorPickerProps {
  color: string,
  onChangeColor: (color: string) => void,
  swatches: string[]
}

export default function ColorPickerWithSwatches({color, onChangeColor, swatches}: ColorPickerProps) {

  function handleSwatchSelect(color: string) {
    onChangeColor(color)
  }

  const wrapperRef = useRef<HTMLDivElement>(null)

  function blur() {
    if (wrapperRef.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur()
    }
  }

  return <div>
    <div ref={wrapperRef}
         onPointerUp={blur}
         onPointerCancel={blur}
    >
      <HexColorPicker color={color} onChange={onChangeColor} />
    </div>
    <div className="flex flex-row flex-wrap">
      {swatches.map((swatch) => {
        return <button
          key={JSON.stringify(swatch)}
          onClick={() => handleSwatchSelect(swatch)}
          aria-label={`Select color ${swatch}`}
          className="aspect-square w-1/12 min-w-11 min-h-11 m-1 rounded-sm"
          style={{background: swatch}}
        />
      })}
    </div>
  </div>
}