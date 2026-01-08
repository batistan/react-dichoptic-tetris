import useDarkMode from "../../useDarkMode.ts";
import SunIcon from "../../icons/SunIcon.tsx";
import MoonIcon from "../../icons/MoonIcon.tsx";

export default function ColorModeSwitch() {
  const [theme, toggleTheme] = useDarkMode();

  return <div>
    <button className="cursor-pointer" onClick={toggleTheme}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  </div>
}