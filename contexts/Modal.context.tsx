import { AnimatePresence } from 'framer-motion';
import React, { createContext, useContext, useState } from 'react';

type Args = Parameters<ContextProps["openModal"]>
interface ContextProps {
   openModal: (name: _ModalState["name"], data?: any, title?: string) => void,
   closeModal(): void,
}

export const ModalContext = createContext({} as ContextProps)
export const useModal = () => useContext(ModalContext)

export const ModalProvider = (props: { children: React.ReactNode }) => {
   const emptyModalState: _ModalState = { name: undefined, data: undefined, title: undefined }
   const [modal, setModal] = useState<_ModalState>(emptyModalState)

   const closeModal = () => setModal(emptyModalState)
   const openModal = (...args: Args) => {
      setModal({ name: args[0], data: args[1], title: args[2] })
   }

   const open = (...args: Args) => {
      const [name, data, title] = args

      switch (name) {
         default:
            return null;
      }
   }

   return (
      <ModalContext.Provider value={{ openModal, closeModal }}>
         {
            <AnimatePresence>
               {modal.name && open(modal.name, modal.data, modal.title)}
            </AnimatePresence>
         }
         {props.children}
      </ModalContext.Provider>
   );
}