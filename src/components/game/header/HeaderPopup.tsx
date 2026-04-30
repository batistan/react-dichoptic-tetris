import {ReactNode, useEffect, useState} from "react";
import {createPortal} from "react-dom";
import Modal from "../Modal.tsx";

interface HeaderPopupProps {
  modalTitle: string;
  label?: string;
  icon: ReactNode;
  children: ReactNode;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  defaultOpen?: boolean;
}

export default function HeaderPopup(
  { modalTitle, label, handleModalOpen, handleModalClose, icon, children, defaultOpen = false }: HeaderPopupProps
) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) {
      handleModalOpen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleLabel = label ?? modalTitle;

  return <div>
    <button
      className="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-md hover:bg-button-hover hover:text-button-hover-text transition-colors"
      aria-label={modalTitle}
      title={modalTitle}
      onClick={() => {
        handleModalOpen()
        setOpen(true)
      }}
    >
      {icon}
      <span className="hidden md:inline text-sm">{visibleLabel}</span>
    </button>
    {createPortal(
      <Modal isOpen={open} title={modalTitle} handleClose={() => {
        handleModalClose()
        setOpen(false)
      }}>
        {children}
      </Modal>, document.body)}
  </div>
}
