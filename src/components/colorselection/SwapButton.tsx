interface SwapButtonProps {
  handleSwap: () => void;
}

export default function SwapButton({handleSwap}: SwapButtonProps) {
  return <button onClick={handleSwap} className="w-1/2 py-2 shadow-xl rounded-md bg-board-bg hover:bg-info-bg">
      <div className="flex gap-2 justify-center">
        <SwapIcon /> Swap
      </div>
  </button>
}

function SwapIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
  </svg>
}
