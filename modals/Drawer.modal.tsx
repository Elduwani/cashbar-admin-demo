import { motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'

interface Props {
    isOpen: boolean,
    title?: string,
    maxWidth?: string,
    close(): void,
    children: React.ReactNode
}
export default function DrawerModal({ children, title, close }: Props) {
    return (
        <motion.div
            key={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 100 }}
            className="fixed top-0 left-0 flex justify-end w-screen h-screen bg-gray-900/50 z-[999]"
        >
            <motion.div
                key={2}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                // style={{ minWidth: 700 }}
                className={`flex-shrink-0 w-full h-full space-y-2 max-w-2xl bg-white shadow-2xl relative overflow-y-auto scrollbar`}
            >
                <div className="px-6 py-3 flex items-center sticky top-0 bg-white z-20">
                    <span onClick={close} className="w-8 h-8 border border-gray-600 grid place-items-center rounded-full cursor-pointer">
                        <FiX className="opacity-60" />
                    </span>
                    <p className="capitalize text-center flex-1">{title}</p>
                </div>
                <div className="max-w-xl mx-auto">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    )
}
