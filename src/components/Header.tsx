import ColorModeSwitch from "./ColorModeSwitch.tsx";

export function Header() {
  return <header className="flex items-center justify-between pb-6">
    <h2 className="text-4xl font-semibold">Dichoptic Tetris</h2>
    <ColorModeSwitch />
  </header>
}