import {settingsContext} from "../../SettingsContext.ts";
import {ReactNode, useContext, useState} from "react";
import HeaderPopup from "./HeaderPopup.tsx";

const hexColorRegex = /^#?[A-F0-9]{6}$/i

export default function Settings(
  { handleModalOpen, handleModalClose }: { handleModalOpen: () => void, handleModalClose: () => void }
) {
  const settings = useContext(settingsContext);

  const [fallingColorHex, setFallingColorHex] = useState(settings.fallingColorHex);
  const [landedColorHex, setLandedColorHex] = useState(settings.landedColorHex);

  function setGhost(checked: boolean) {
    settings.updateSettings({...settings, showGhost: checked});
  }

  function setFallColor(colorHex: string) {
    setFallingColorHex(colorHex);
    if (colorHex.match(hexColorRegex)) {
      settings.updateSettings({...settings, fallingColorHex: colorHex});
    }
  }

  function setLandedColor(colorHex: string) {
    setLandedColorHex(colorHex);
    if (colorHex.match(hexColorRegex)) {
      settings.updateSettings({...settings, landedColorHex: colorHex});
    }
  }

  function onClose() {
    setFallingColorHex(settings.fallingColorHex);
    setLandedColor(settings.landedColorHex);
    handleModalClose();
  }

  return <HeaderPopup
    modalTitle="Settings"
    handleModalOpen={handleModalOpen}
    handleModalClose={onClose}
    icon={<Cog/>}
  >
    <form method="dialog" className="p-3 drop-shadow-md">
      <div className="flex flex-col gap-2 p-3 text-text">
        <FormField label="Show Ghost?">
          <input
            name="showGhost"
            type="checkbox"
            className="w-5"
            checked={settings.showGhost}
            onChange={(e) => setGhost(e.target.checked)}
          />
        </FormField>
        <FormField label="Falling Block Color (Hex #RRGGBB)">
          <input
            name="fallingColor"
            type="text"
            className="font-mono uppercase w-1/4 bg-background px-1 text-right"
            value={fallingColorHex}
            onChange={(e) => setFallColor(e.target.value)}
          />
        </FormField>
        <FormField label="Landed Block Color (Hex #RRGGBB)">
          <input
            name="landedColor"
            type="text"
            className="font-mono uppercase w-1/4 bg-background px-1 text-right"
            value={landedColorHex}
            onChange={(e) => setLandedColor(e.target.value)}
          />
        </FormField>
      </div>
    </form>
  </HeaderPopup>
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex flex-row justify-between hover:bg-board-bg p-2 rounded-md">
    <span className="mx-2">{label}</span>
    {children}
  </label>
}

function Cog() {
  return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )
}