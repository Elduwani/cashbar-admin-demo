import SubscriptionHistory from '@layouts/customers/Customers.subscription.transactions';
import { AnimatePresence } from 'framer-motion';
import DrawerModal from 'modals/Drawer.modal';
import React, { createContext, useContext, useState } from 'react';

type Args = Parameters<ContextProps["openModal"]>
interface ContextProps {
   openModal: (name: _ModalState["name"], data?: any, title?: string) => void,
   closeModal(): void,
}

const emptyModalState: _ModalState = { name: undefined, data: undefined, title: undefined }
export const ModalContext = createContext({} as ContextProps)
export const useModal = () => useContext(ModalContext)

export const ModalProvider = (props: { children: React.ReactNode }) => {
   const [modal, setModal] = useState<_ModalState>(emptyModalState)

   const closeModal = () => setModal(emptyModalState)
   const openModal = (...args: Args) => {
      setModal({ name: args[0], data: args[1], title: args[2] })
   }

   const open = (...args: Args) => {
      const [name, data, title] = args

      switch (name) {
         case "subscriptionHistory":
            return (
               <DrawerModal
                  isOpen={modal.name === name}
                  close={closeModal}
               >
                  <SubscriptionHistory data={data} />
               </DrawerModal>
            )
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