import ColorModeSwitch from "./ColorModeSwitch.tsx";
import Settings from "./Settings.tsx";
import Tutorial from "./Tutorial.tsx";
import Github from "./Github.tsx";

export function Header(
  { handleModalOpen, handleModalClose }: { handleModalOpen: () => void, handleModalClose: () => void }
) {

  return <header className="p-3 flex flex-row justify-between bg-header shadow-md">
    <h1 className="text-xl">Dichoptic Tetris</h1>
    <div className="flex justify-between gap-2">
      <Tutorial handleModalOpen={handleModalOpen} handleModalClose={handleModalClose} />
      <Settings handleModalOpen={handleModalOpen} handleModalClose={handleModalClose} />
      <ColorModeSwitch />
      <Github />
    </div>
  </header>
}