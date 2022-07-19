import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { FiCheck, FiInfo, FiX } from 'react-icons/fi';
import { v4 as uuid } from "uuid";

interface ContextInterface {
    notify: (args: ToastProps) => void,
    deNotify: (id: string) => void
}
interface ToastProps {
    id?: string,
    message: string,
    variant?: 'success' | 'warning' | 'error',
    close?(): void,
    duration?: number
}

export const ToastContext = createContext({} as ContextInterface)
export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastProps[]>([])

    function notify(el: ToastProps) {
        //Limit number of toast that can be shown at a time.
        if (toast.length < 4) {
            setToast(prv => [...prv, { ...el, id: uuid() }])
        }
    }

    function deNotify(id?: string) {
        const newQueue = toast.filter(toast => toast.id !== id)
        setToast(newQueue)
    }

    const clearToast = () => setToast([])

    return (
        <ToastContext.Provider value={{ notify, deNotify }}>
            {children}
            <AnimatePresence initial={false}>
                {
                    toast.length ?
                        <ul className={`w-full max-w-md flex flex-col absolute top-4 left-1/2 -translate-x-1/2 
                            z-[999] bg-white/95 p-1 rounded-xl divide-y divide-gray-200 shadow-xl border
                        `}>
                            {
                                toast.map(t =>
                                    <Toast
                                        {...t}
                                        key={t.id}
                                        close={() => deNotify(t.id as string)}
                                    />
                                )
                            }
                            {
                                toast.length > 1 ?
                                    <li className="absolute top-0 -right-2 translate-x-full bg-blue-600 text-white rounded-full p-2 border-none" onClick={clearToast}>
                                        <FiX className="text-md cursor-pointer" />
                                    </li>
                                    : null
                            }
                        </ul>
                        : null
                }
            </AnimatePresence>
        </ToastContext.Provider>
    );
}

function Toast({ message, variant, close, duration = 5000 }: ToastProps) {
    const closeRef = useRef(close)
    closeRef.current = close

    useEffect(() => {
        const timer = setTimeout(() => closeRef.current?.(), duration);
        return () => clearTimeout(timer)
        // eslint-disable-next-line
    }, []);

    const { styles, icon } = getStyles(variant)

    return (
        <motion.li
            // positionTransition
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, transition: { type: "tween", duration: 0.3 } }}
            exit={{ opacity: 0 }}
            className={`p-4 py-2 w-full flex items-center space-x-3 text-sm ${styles}`}
        >
            {icon}
            <p className={`flex-1 truncate`}>{message}</p>
            <div className="h-full grid place-items-center" onClick={close}>
                <FiX className="text-xl cursor-pointer" />
            </div>
        </motion.li>
    )
}

function getStyles(variant?: ToastProps['variant']) {
    switch (variant) {
        case "error":
            return {
                styles: "bg-red-60 text-red-600",
                icon: <FiInfo className="text-xl" />
            }
        default:
            return {
                styles: "bg-blue-60 text-blue-700",
                icon: <FiCheck className="text-xl" />
            }
    }
}