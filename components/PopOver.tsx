import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { IconType } from 'react-icons'
import { FiMoreVertical } from 'react-icons/fi'

export interface _PopoverMenu {
   label: string,
   action: (args?: any) => any,
   icon?: IconType
   enabled?: boolean
}

type Props = {
   open?: boolean,
   setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
   button: React.ReactNode,
   children: React.ReactNode,
   maxWidth?: number,
   className?: string
}

export default function PopOver({ button, maxWidth, children, className }: Props) {
   return (
      <Popover className='relative'>
         <Popover.Button as="div">{button}</Popover.Button>
         <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
         >
            <Popover.Panel
               style={{ width: 600, maxWidth }}
               className={`absolute z-40 w-full px-4 mt-3 sm:px-0 max-w-sm ${className}`}
            >
               <div className="bg-white overflow-hidden shadow-xl ring-1 ring-gray-300 rounded-lg">
                  {children}
               </div>
            </Popover.Panel>
         </Transition>
      </Popover>
   )
}

interface ActionMenuProps {
   menu: _PopoverMenu[],
   className?: string
}
export function ActionMenu({ menu, className }: ActionMenuProps) {
   return (
      <PopOver
         maxWidth={200}
         className="right-0"
         button={
            <span className={`h-10 px-1.5 grid place-content-center rounded-md cursor-pointer ${className}`}>
               <FiMoreVertical className="text-lg" />
            </span>
         }
      >
         <ul className='divide-y capitalize text-sm'>
            {
               menu.map(m => {
                  const { icon: Icon, label, action, enabled = true } = m
                  if (!enabled) return null

                  return (
                     <li
                        key={label}
                        onClick={action}
                        className={`
                                    px-4 py-3 flex items-center space-x-4 capitalize group
                                    cursor-pointer select-none hover:bg-blue-600 hover:text-white
                                `}
                     >
                        {
                           Icon && <Icon className='text-lg text-gray-400 group-hover:text-blue-400' />
                        }
                        <span>{label}</span>
                     </li>
                  )
               })
            }
         </ul>
      </PopOver>
   )
}
