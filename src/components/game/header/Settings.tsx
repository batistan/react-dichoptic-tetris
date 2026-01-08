import {settingsContext} from "../../SettingsContext.ts";
import {ReactNode, useContext, useState} from "react";
import HeaderPopup from "./HeaderPopup.tsx";
import CogIcon from "../../icons/CogIcon.tsx";
import {isValidHexColor} from "../../../utils/colorValidation.ts";

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
    if (isValidHexColor(colorHex)) {
      settings.updateSettings({...settings, fallingColorHex: colorHex});
    }
  }

  function setLandedColor(colorHex: string) {
    setLandedColorHex(colorHex);
    if (isValidHexColor(colorHex)) {
      settings.updateSettings({...settings, landedColorHex: colorHex});
    }
  }

  function onClose() {
    setFallingColorHex(settings.fallingColorHex);
    setLandedColorHex(settings.landedColorHex);
    handleModalClose();
  }

  return <HeaderPopup
    modalTitle="Settings"
    handleModalOpen={handleModalOpen}
    handleModalClose={onClose}
    icon={<CogIcon/>}
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