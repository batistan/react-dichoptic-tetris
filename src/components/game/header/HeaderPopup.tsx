import {ReactNode, useState} from "react";
import {createPortal} from "react-dom";
import Modal from "../Modal.tsx";

interface HeaderPopupProps {
  modalTitle: string;
  icon: ReactNode;
  children: ReactNode;
  handleModalOpen: () => void;
  handleModalClose: () => void;
}

export default function HeaderPopup(
  { modalTitle, handleModalOpen, handleModalClose, icon, children }: HeaderPopupProps
) {
  const [open, setOpen] = useState(false);

  return <div>
    <button className="cursor-pointer" onClick={() => {
    handleModalOpen()
    setOpen(true)
  }}>{icon}</button>
    {createPortal(
      <Modal isOpen={open} title={modalTitle} handleClose={() => {
        handleModalClose()
        setOpen(false)
      }}>
        {children}
      </Modal>, document.body)}
  </div>
}