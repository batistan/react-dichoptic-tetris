import ColorModeSwitch from "./ColorModeSwitch.tsx";

export function Header() {
  return <header className="px-3 pt-3 flex flex-row justify-between">
    <h1 className="font-mono font-light">Dichoptic Tetris</h1>
    <div>
      <ColorModeSwitch />
    </div>
  </header>
}