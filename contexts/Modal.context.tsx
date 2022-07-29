import Modal from '@modals/Modal';
import { AnimatePresence } from 'framer-motion';
import DrawerModal from 'modals/Drawer.modal';
import React, { createContext, useContext, useState } from 'react';

interface _State {
   element: React.ReactNode,
   title?: string,
   type: 'drawer' | 'modal'
}
interface ContextProps {
   openModal: (props: _State) => void,
   closeModal(): void,
}

// const emptyState: Partial<_State> = { element: undefined, title: undefined, type: undefined }
export const ModalContext = createContext({} as ContextProps)
export const useModal = () => useContext(ModalContext)

export const ModalProvider = (props: { children: React.ReactNode }) => {
   const [modal, setModal] = useState<_State | undefined>()

   const closeModal = () => setModal(undefined)
   const openModal: ContextProps['openModal'] = (props) => {
      setModal({ element: props.element, type: props.type, title: props.title })
   }

   const open = () => {
      if (modal?.element) {
         const { element, type, title } = modal

         switch (type) {
            case "drawer":
               return (
                  <DrawerModal
                     title={title}
                     isOpen={!!element}
                     close={closeModal}
                  >
                     {element}
                  </DrawerModal>
               )
            case "modal":
               return (
                  <Modal
                     title={title}
                     isOpen={!!element}
                     close={closeModal}
                  >
                     {element}
                  </Modal>
               )
            default:
               return null;
         }
      }
      return null
   }

   return (
      <ModalContext.Provider value={{ openModal, closeModal }}>
         {
            <AnimatePresence>
               {modal?.element && open()}
            </AnimatePresence>
         }
         {props.children}
      </ModalContext.Provider>
   );
}