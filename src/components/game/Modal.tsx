import {ReactNode, useEffect, useRef, PointerEvent} from "react";

interface ModalProps {
  children: ReactNode;
  title: string,
  isOpen: boolean;
  handleClose: () => void;
}

export default function Modal({children, title, isOpen, handleClose}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function closeDialog() {
    handleClose();
    dialogRef.current?.close();
  }

  useEffect(() => {
    const currentRef = dialogRef.current;

    if (isOpen) {
      currentRef?.showModal();
    }
  }, [isOpen, handleClose]);

  function handlePointerDown(e: PointerEvent<HTMLDialogElement>) {
    // close modal on click outside its containing div (which should occupy all the dialog's visible area)
    // need to be a little weird here since a dialog opened in modal mode captures all clicks in the viewport
    if ((e.target as Element)?.closest(".dialog-modal") === null) {
      closeDialog();
    }
  }

  return <dialog
    ref={dialogRef}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-md"
    onPointerDown={handlePointerDown}
    onClose={handleClose}
  >
    <div className="dialog-modal flex flex-col bg-header">
      <div className="flex flex-row-reverse justify-between w-full p-1 border-b-1 border-background">
        <button className="w-fit hover:text-button-hover-text text-text text-center hover:bg-button-hover rounded-md p-2 aspect-square" onClick={closeDialog}><CloseIcon /></button>
        <h2 className="text-center text-xl text-text pt-1 pl-2">{title}</h2>
      </div>
      {children}
    </div>
    </dialog>
}

function CloseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
}
