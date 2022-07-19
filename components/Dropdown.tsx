import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { notifications } from "@utils/dummyData"
import { FiCornerDownRight } from "react-icons/fi";

const defaultLinks = [
    { label: "Sign in", link: "#", borderTop: false },
    { label: "Sign up for free", link: "#" }
]

/**
 * @param {ReactElement} children //Must provide your own styled button 
 * @param {[Object]} menuList //Menu list options 
*/
export default function Dropdown({ children, menuList = defaultLinks, width, header }) {
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
                                className={`absolute right-0 mt-2 origin-top-right bg-white border 
                                    border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg 
                                    outline-none ${width ?? "w-56"}`
                                }
                            >
                                {header}
                                <div className="py-1">
                                    {
                                        menuList.map(menu => {
                                            const { label, link, icon, callback, borderTop } = menu
                                            return (
                                                <Menu.Item key={label}>
                                                    {({ active }) => (
                                                        <Link
                                                            href={link ?? `#`}
                                                            onClick={callback && callback}
                                                            className={
                                                                `flex items-center px-4 py-2.5 text-sm leading-5 text-left space-x-3 
                                                                ${active ? "bg-gray-100" : "bg-white"} 
                                                                ${borderTop && "border-t border-gray-200"} `
                                                            }
                                                        >
                                                            {icon &&
                                                                <span className={`text-lg ${active ? "text-indigo-600" : "text-gray-700"}`}>{icon}</span>
                                                            }
                                                            <span className={active ? "text-indigo-600" : "text-gray-700"}>{label}</span>
                                                        </Link>
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

export function Notifications({ children }) {
    // const { customers } = useCustomer()

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
                                                        <div className={`flex px-4 py-2.5 text-sm leading-5 text-left space-x-3 cursor-pointer
                                                            ${active ? "bg-blue-50" : "bg-white"}`
                                                        }>
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
