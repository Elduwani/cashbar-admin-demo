import { Menu, Transition } from "@headlessui/react";
import { notifications } from "@utils/dummyData";
import { cx } from "@utils/index";
import { IconType } from "react-icons";
import { FiCornerDownRight } from "react-icons/fi";

export interface _MenuDropDown {
   label: string,
   link?: string,
   icon?: IconType,
   onClick?: any,
   highlightColor?: string
   borderTop?: boolean
}

interface Props {
   children: React.ReactNode,
   menuList: _MenuDropDown[],
   width?: string,
   header?: React.ReactNode
   email?: string
}

const defaultLinks = [
   { label: "Sign in", link: "#", borderTop: false },
   { label: "Sign up for free", link: "#" }
]

export default function Dropdown({ menuList = defaultLinks, ...props }: Props) {
   return (
      <div className="relative inline-block text-left z-20">
         <Menu>
            {({ open }) => (
               <>
                  <span className="rounded-md shadow-sm">
                     <Menu.Button as="div" className="cursor-pointer">{props.children}</Menu.Button>
                  </span>

                  <Transition
                     show={open}
                     enter="transition ease-out duration-100"
                     enterFrom="transform opacity-0 scale-95"
                     enterTo="transform opacity-100 scale-100"
                     leave="transition ease-in duration-75"
                     leaveFrom="transform opacity-100 scale-100"
                     leaveTo="transform opacity-0 scale-95"
                  >
                     <Menu.Items
                        static
                        className={cx(
                           "absolute right-0 mt-2 origin-top-right bg-white border",
                           "border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg",
                           `outline-none ${props.width ?? "w-56"}`
                        )}
                     >
                        {props.header}
                        <div className="py-1">
                           {
                              menuList.map(menu => {
                                 const {
                                    label,
                                    icon: Icon,
                                    onClick,
                                    highlightColor = 'bg-indigo-600 text-white',
                                    borderTop
                                 } = menu

                                 return (
                                    <Menu.Item key={label}>
                                       {({ active }) => (
                                          <button
                                             onClick={onClick}
                                             className={cx(
                                                'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                                                `${active && highlightColor}`,
                                                `${borderTop && 'border-t'}`
                                             )}
                                          >
                                             <div className="flex items-center space-x-3">
                                                {Icon && <Icon className="text-lg opacity-70" />}
                                                <span>{label}</span>
                                             </div>
                                          </button>
                                       )}
                                    </Menu.Item>
                                 )
                              })
                           }
                        </div>
                     </Menu.Items>
                  </Transition>
               </>
            )}
         </Menu>
      </div>
   );
}

export function Notifications({ children }: Partial<Props>) {
   return (
      <div className="relative inline-block text-left z-20">
         <Menu>
            {({ open }) => (
               <>
                  <span className="rounded-md shadow-sm">
                     <Menu.Button as="div" className="cursor-pointer">{children}</Menu.Button>
                  </span>

                  <Transition
                     show={open}
                     enter="transition ease-out duration-100"
                     enterFrom="transform opacity-0 scale-95"
                     enterTo="transform opacity-100 scale-100"
                     leave="transition ease-in duration-75"
                     leaveFrom="transform opacity-100 scale-100"
                     leaveTo="transform opacity-0 scale-95"
                  >
                     <Menu.Items
                        static
                        style={{ width: 320 }}
                        className={`absolute right-0 mt-2 origin-top-right bg-white border overflow-hidden 
                                    border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none py-3`
                        }
                     >
                        <div className="">
                           {
                              notifications.map((item, i) => {
                                 const { userID, message, timestamp } = item
                                 const { first_name, last_name } = { first_name: 'John', last_name: 'Doe' }
                                 const interval = i % 2 === 0
                                 return (
                                    <Menu.Item key={i}>
                                       {({ active }) => (
                                          <div
                                             className={`
                                                flex px-4 py-2.5 text-sm leading-5 text-left space-x-3 cursor-pointer
                                                ${active ? "bg-blue-50" : "bg-white"}
                                             `}
                                          >
                                             <div className={`rounded-full grid flex-shrink-0 w-6 h-6 place-items-center text-gray-600`}>
                                                {interval ? <FiCornerDownRight className="text-lg text-gray-400" /> : null}
                                             </div>
                                             <p className={interval ? "text-indigo-900" : "text-gray-500"}>
                                                {userID ? `${first_name} ${last_name} ${message}` : message}
                                                <span className={"block mt-1 text-gray-400 text-xs"}>{timestamp}</span>
                                             </p>
                                          </div>
                                       )}
                                    </Menu.Item>
                                 )
                              })
                           }
                        </div>
                     </Menu.Items>
                  </Transition>
               </>
            )}
         </Menu>
      </div>
   );
}
