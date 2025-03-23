import {useEffect, useState} from 'react'
import "./app.css"
import Game from "./game/Game.tsx";
import ColorSelection from "./colorselection/ColorSelection.tsx";
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

  useEffect(() => {
    const prevSettings = localStorage?.getItem && localStorage.getItem("settings");

    if (prevSettings !== null) {
      setSettings(JSON.parse(atob(prevSettings)))
    }

    return () => {
      // save current settings on exit
      localStorage.setItem("settings", btoa(JSON.stringify(settings)))
    }
  }, []);

  const handleFallingColorChange = (s: string) => {
    setSettings((prev) => ({ ...prev, fallingColorHex: s }))
  }

  const handleLandedColorChange = (s: string) => {
    setSettings((prev) => ({ ...prev, landedColorHex: s }))
  }

  return (
    <div className="h-full box-border bg-background text-text">
      <settingsContext.Provider value={settings}>
        <Header />
        <div className={containerClasses}>
          <ColorSelection
            handleFallingColorChange={handleFallingColorChange}
            handleLandedColorChange={handleLandedColorChange}
          />
          <Game />
        </div>
      </settingsContext.Provider>
    </div>
  )
}

export default App
