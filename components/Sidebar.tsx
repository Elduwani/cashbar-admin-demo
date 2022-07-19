import { useScreenSize } from "@hooks/index"
import { isActivePath, protectedRoutes, _Route } from "@hooks/routes"
import { slugify } from "@utils/index"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FiPlus } from "react-icons/fi"
import { HiEye, HiEyeOff } from "react-icons/hi"
import Button from "./Button"

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true)
    const screenSize = useScreenSize()
    const isMobile = screenSize.match(/xs|sm|md/i)

    useEffect(() => {
        if (!screenSize.match(/lg/i) && isOpen) {
            setIsOpen(false)
        }
    }, [screenSize])

    return (
        <div
            className={`
                transition-all h-full flex flex-col flex-shrink-0 pb-6
                border-r items-center overflow-x-hidden
                ${isOpen ? 'w-[200px]' : isMobile ? 'w-14' : 'w-20'}
                ${true ? 'bg-blue-800' : 'bg-gray-800'}
            `}
        >
            <div className="h-24 w-full px-4 grid place-items-center">
                {
                    isOpen &&
                    <Button
                        variant="blue"
                        icon={FiPlus}
                    // onClick={() => openModal("addCustomer")}
                    >New Customer</Button>
                }
            </div>
            <div className="w-full flex-1 overflow-y-auto scrollbar relative">
                {
                    protectedRoutes.map((route, i) => {
                        return (
                            <NavLink
                                index={i}
                                key={route.name + i}
                                route={route}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                            />
                        )
                    })
                }
            </div>

            {
                //Toggle sidebar collapse / open
                <div
                    onClick={() => setIsOpen(v => !v)}
                    className={`
                    h-12 w-full flex text-sm items-center cursor-pointer text-blue-300 space-x-2
                    ${isOpen ? 'px-4' : 'justify-center'}
                `}
                >
                    {
                        isOpen ?
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: "tween" }}
                                className='flex items-center space-x-2'
                            ><HiEyeOff /><span>Hide sidebar</span>
                            </motion.div>
                            : <HiEye className="text-xl" />
                    }
                </div>
            }
        </div>
    )
}

interface Props {
    route: _Route
    index: number
    isSelected?: boolean
    setSelected?: React.Dispatch<React.SetStateAction<number | null>>
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
    isOpen?: boolean
    pathname?: string
    level?: number
}
function NavLink({ route, isOpen }: Props) {
    const router = useRouter()
    const { name, icon: Icon, path, enabled = true } = route
    const matched = isActivePath(router.pathname, path as string)

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation()
        router.push(path ?? slugify(name))
    }

    return (
        <div className="w-full">
            <div
                onClick={handleClick}
                className={`
                    h-14 flex items-center px-6 space-x-4 cursor-pointer outline-none relative capitalize border-opacity-25 text-sm 
                    ${!isOpen && "justify-center"} 
                    ${!enabled && 'pointer-events-none opacity-50'}
                    ${matched && isOpen ? "shadow-lg" : ""}
                    ${matched ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}
                `}
            >
                {
                    // Icons
                    <span
                        aria-label="sidebar-icon"
                        className={`transition-colors w-4 h-8 flex items-center justify-center`}
                    >
                        {
                            Icon ?
                                <Icon className={`${isOpen ? 'text-xl' : 'text-2xl'} flex-shrink-0`} /> :
                                <span className="h-2 w-2 bg-gray-400 rounded-full"></span>
                        }
                    </span>
                }
                {
                    // Only render these if sidebar is expanded
                    isOpen &&
                    <motion.span
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1, transition: { type: 'tween' } }}
                        className={`flex-1 truncate select-none`}
                    >{name}</motion.span>
                }
                {
                    // Selected page vertical indicator
                    matched && <span className="h-full block absolute right-0 top-0 border-r-4 border-blue-300"></span>
                }
            </div>
        </div>
    )
}