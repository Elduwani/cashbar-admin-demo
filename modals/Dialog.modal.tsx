import Button, { ButtonProps } from '@components/Button'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

type _ButtonProps = {
   text: string
   variant?: ButtonProps['variant']
}
export interface DialogProps {
   isOpen: boolean
   close(): void
   title?: string
   message: string
   accept(): void
   decline?(): void
   buttons: {
      accept: _ButtonProps
      decline?: Partial<_ButtonProps>
   }
}
export default function CustomDialog(props: DialogProps) {
   return (
      <Transition appear show={props.isOpen} as={Fragment}>
         <Dialog as="div" className="relative z-[1999]" onClose={props.close}>
            <Transition.Child
               as={Fragment}
               enter="ease-out duration-300"
               enterFrom="opacity-0"
               enterTo="opacity-100"
               leave="ease-in duration-200"
               leaveFrom="opacity-100"
               leaveTo="opacity-0"
            >
               <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
               <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                     as={Fragment}
                     enter="ease-out duration-300"
                     enterFrom="opacity-0 scale-95"
                     enterTo="opacity-100 scale-100"
                     leave="ease-in duration-200"
                     leaveFrom="opacity-100 scale-100"
                     leaveTo="opacity-0 scale-95"
                  >
                     <Dialog.Panel className="w-full max-w-md transform overflow-hidden space-y-4 rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                           as="h3"
                           className="text-lg font-medium leading-6"
                        >{props.title ?? 'Are you sure?'}</Dialog.Title>
                        <hr />
                        <p className="text-sm">{props.message}</p>

                        <div className="pt-2 grid grid-cols-2 gap-4">
                           <Button
                              variant={props.buttons.decline?.variant ?? 'white'}
                              onClick={() => {
                                 props.decline?.()
                                 props.close()
                              }}
                           >{props.buttons.decline?.text ?? "No, thanks"}
                           </Button>
                           <Button
                              variant={props.buttons.accept.variant ?? 'blue'}
                              onClick={() => {
                                 props.accept()
                                 props.close()
                              }}
                           >{props.buttons.accept.text}
                           </Button>
                        </div>
                     </Dialog.Panel>
                  </Transition.Child>
               </div>
            </div>
         </Dialog>
      </Transition>
   )
}