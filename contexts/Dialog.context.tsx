import CustomDialog, { DialogProps } from '@modals/Dialog.modal';
import { createContext, useContext, useState } from 'react';

type Params = Omit<DialogProps, 'isOpen' | 'close'>
interface ContextProps {
   open: (params: Params) => void,
   close(): void,
}

export const DialogContext = createContext({} as ContextProps)
export const useDialog = () => useContext(DialogContext)

export const DialogProvider = (props: { children: React.ReactNode }) => {
   const [params, setParams] = useState<Params>()

   const close = () => setParams(undefined)
   const open: ContextProps['open'] = (params) => setParams(params)

   return (
      <DialogContext.Provider value={{ open, close }}>
         {
            !!params &&
            <CustomDialog
               close={close}
               isOpen={!!params}
               title={params.title}
               message={params.message}
               accept={params.accept}
               decline={params.decline}
               buttons={params.buttons}
            />
         }
         {props.children}
      </DialogContext.Provider>
   );
}