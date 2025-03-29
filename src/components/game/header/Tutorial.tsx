import HeaderPopup from "./HeaderPopup.tsx";

export default function Tutorial(
  { handleModalOpen, handleModalClose }: { handleModalOpen: () => void, handleModalClose: () => void }
) {
  return <HeaderPopup
    modalTitle="About"
    handleModalOpen={handleModalOpen}
    handleModalClose={handleModalClose}
    icon={<InfoIcon />}
  >
    <div className="flex flex-col gap-2 p-3 text-text">
      <p>
        Welcome to Dichoptic Tetris!
      </p>
      <p>
        Falling blocks appear in one color, while landed blocks appear in another.
        Use the provided color pickers to match the lens colors of your specialized
        glasses&mdash;similar to red/blue 3D glasses&mdash;or any two colors you prefer.
      </p>
      <p>
        With only one eye able to see falling blocks, and only the other being able to see landed blocks,
        both eyes must work together to play, dichotic Tetris encourages your eyes to work together, which may
        improve coordination between them.
      </p>
      <p>
        <Link url="https://www.sciencedaily.com/releases/2013/04/130422122953.htm" label="Preliminary" />&nbsp;
        <Link url="https://pmc.ncbi.nlm.nih.gov/articles/PMC9718499/" label="studies" /> indicate that regular
        sessions may improve lazy eye symptoms in adults over time.
      </p>
      <h3 className="pt-2 text-lg border-t-1 border-background">Controls</h3>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col gap-3">
          <p><KeyDisplay button="ESC"/> / <KeyDisplay button={"Tap"}/> &ndash; Pause / Resume</p>
          <p><KeyDisplay button="A"/> / <KeyDisplay button="←" /> &ndash; Move Left</p>
          <p><KeyDisplay button="D"/> / <KeyDisplay button="→" /> &ndash; Move Right</p>
          <p><KeyDisplay button="W"/> / <KeyDisplay button="↑" /> &ndash; Rotate Clockwise</p>
          <p><KeyDisplay button="S"/> / <KeyDisplay button="↓" /> &ndash; Move Down</p>
          <p><KeyDisplay button="C"/> &ndash; Rotate Counter-Clockwise</p>
        </div>
        <div className="flex flex-col gap-2">
          <p><KeyDisplay button="Shift" /> &ndash; Hold Block</p>
          <p><KeyDisplay button="Space" /> / <KeyDisplay button={"Double Tap"} /> &ndash; Hard Drop</p>
        </div>
      </div>
    </div>
  </HeaderPopup>
}

function Link({ url, label }: { url: string, label: string }) {
  return <a className="underline hover:text-text-bright"
            href={url}
            target="_blank"
            rel="noopener noreferrer">
    {label}
  </a>;
}

function InfoIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>

}

function KeyDisplay({ button }: { button: string }) {
  return <span className="font-mono rounded-md shadow-sm p-1 border-1">{button}</span>
}
