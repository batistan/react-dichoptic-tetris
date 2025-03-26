import {useEffect, useState} from 'react'
import "./app.css"
import Game from "./game/Game.tsx";
import ColorSelection from "./color-selection/ColorSelection.tsx";
import {Header} from "./game/header/Header.tsx";
import {defaultSettings, Settings, settingsContext} from "./SettingsContext.ts";

const containerClasses = [
  "flex",
  "items-center",
  "gap-2",
  "mt-4",
  "flex-col",
  "md:flex-row",
  "md:align-middle",
  "md:justify-around",
].join(' ');

function App() {

  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("settings", btoa(JSON.stringify(settings)))
  }, [settings]);

  const handleFallingColorChange = (s: string) => {
    setSettings((prev) => ({ ...prev, fallingColorHex: s }))
  }

  const handleLandedColorChange = (s: string) => {
    setSettings((prev) => ({ ...prev, landedColorHex: s }))
  }

  return (
    <div className="h-full box-border bg-background text-text">
      <settingsContext.Provider value={
        { ...settings, updateSettings: (s: Settings) => { setSettings(s); return s } }
      }>
        <Header
          handleModalOpen={() => {
            // don't capture input while a modal is open
            console.log("Opening modal.")
            setInputDisabled(true);
          }}
          handleModalClose={() => {
            console.log("Closing modal.")
            setInputDisabled(false);
          }}
        />
        <div className={containerClasses}>
          <ColorSelection
            handleFallingColorChange={handleFallingColorChange}
            handleLandedColorChange={handleLandedColorChange}
          />
          <Game inputDisabled={inputDisabled} />
        </div>
      </settingsContext.Provider>
    </div>
  )
}

export default App
