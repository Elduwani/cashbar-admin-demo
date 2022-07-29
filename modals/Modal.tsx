import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { FiX } from 'react-icons/fi'

interface Props {
   isOpen: boolean,
   maxWidth?: string,
   title?: string,
   close(): void,
   children: React.ReactNode
}
export default function Modal({ children, title, isOpen, maxWidth = "max-w-2xl", close }: Props) {
   return (
      <Transition appear show={isOpen} as={Fragment}>
         <Dialog
            as="div"
            className="fixed inset-0 grid items-center z-[999]"
            onClose={close}
         >
            <div
               // style={{ maxHeight: "90%" }}
               className=" text-center h-full overflow-y-auto scrollbar py-14"
            >
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-900/70" />
               </Transition.Child>

               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
               >
                  <div className={`
                            inline-block w-full ${maxWidth} text-left shadow-2xl
                            bg-white transition-all transform rounded-xl
                        `}>
                     <div className="border-b px-6 py-3 flex justify-between items-center">
                        <h3 className="capitalize w-full text-sm text-center">{title}</h3>
                        <span
                           className="border border-gray-600 flex-shrink-0 w-6 h-6 grid place-items-center rounded-full cursor-pointer"
                           onClick={close}
                        ><FiX /></span>
                     </div>
                     {children}
                  </div>
               </Transition.Child>
            </div>
         </Dialog>
      </Transition>
   )
}
