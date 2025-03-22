import ColorModeSwitch from "./ColorModeSwitch.tsx";

export function Header() {
  return <header className="p-3 flex flex-row justify-between border-b-2 border-b-text-bright bg-header">
    <h1 className="font-sans font-light">Dichoptic Tetris</h1>
      <ColorModeSwitch />
  </header>
}