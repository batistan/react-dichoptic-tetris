import ColorModeSwitch from "./ColorModeSwitch.tsx";

export function Header() {
  return <header className="p-5 flex flex-row justify-between">
    <h2 className="font-mono uppercase">Dichoptic Tetris</h2>
    <div>
      <ColorModeSwitch />
    </div>
  </header>
}