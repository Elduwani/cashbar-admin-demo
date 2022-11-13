import CustomDialog, { DialogProps } from '@modals/Dialog.modal';
import { createContext, useContext, useState } from 'react';

type Params = Omit<DialogProps, 'isOpen'>
interface ContextProps {
   openDialog: (params: Params) => void,
   closeDialog(): void,
}

export const DialogContext = createContext({} as ContextProps)
export const useDialog = () => useContext(DialogContext)

export const DialogProvider = (props: { children: React.ReactNode }) => {
   const [params, setParams] = useState<Params>()
   const closeDialog = () => setParams(undefined)
   const openDialog: ContextProps['openDialog'] = (params) => setParams(params)

   return (
      <DialogContext.Provider value={{ openDialog, closeDialog }}>
         {
            !!params &&
            <CustomDialog
               close={closeDialog}
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