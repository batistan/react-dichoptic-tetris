const styles = [
  "drop-shadow-md"
].join()

interface PopupProps {
  text: string;
  callToAction: string;
  handleClick: () => void;
}

export default function Popup({text, callToAction, handleClick}: PopupProps) {
  return <div className={styles}>
    <span>{text}</span>
    <button onClick={handleClick}>{callToAction}</button>
  </div>
}