import {ReactNode} from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

/**
 * Primary button component with consistent styling across the app
 */
export default function PrimaryButton({ children, onClick, className = "" }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-info-bg hover:bg-button-hover text-text-dark hover:text-button-hover-text shadow-md rounded-md p-1 ${className}`}
    >
      {children}
    </button>
  );
}
