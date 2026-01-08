import SwapIcon from "../icons/SwapIcon.tsx";
import PrimaryButton from "../common/PrimaryButton.tsx";

interface SwapButtonProps {
  handleSwap: () => void;
}

export default function SwapButton({handleSwap}: SwapButtonProps) {
  return <PrimaryButton onClick={handleSwap} className="w-1/2 py-2 shadow-xl">
      <div className="flex gap-2 justify-center">
        <SwapIcon /> Swap
      </div>
  </PrimaryButton>
}
