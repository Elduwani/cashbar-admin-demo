import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { IconType } from 'react-icons/lib';

export type ButtonProps = {
    children?: React.ReactNode,
    className?: string,
    icon?: IconType,
    onClick?: (arg?: any) => void,
    goto?: string,
    type?: "button" | "submit" | "reset",
    disabled?: boolean,
    variant?: boolean | "outline" | "blue" | "green" | "red" | "gray-3" | "gray-2" | "gray-1" | "white",
    border?: string,
    defaultClasses?: string,
    shrink?: boolean
    iconColor?: string
    secondary?: boolean
}
export default function Button(props: ButtonProps) {
    const router = useRouter()
    const { icon: Icon, iconColor, border, disabled, variant = 'gray-1' } = props

    function handleClick() {
        props.onClick?.()
        if (props.goto && typeof props.goto === "string") router.push(props.goto)
    }

    const defaultClasses = `w-full max-w-md outline-none py-0 flex-shrink-0 text-sm
        ${props.secondary ? 'h-8 rounded-md' : 'h-10 rounded-lg'} flex items-center justify-center hover:bg-opacity-70 
        ${props.children ? 'px-6' : 'px-3'} ${Icon && ''}
        ${props.children && Icon ? 'space-x-2 pl-4' : ''}
        whitespace-nowrap focus:outline-none disabled:opacity-50 capitalize animated
        ${!props.disabled ? "cursor-pointer" : "cursor-default"}
    `
    const Wrapper = ({ children }: ButtonProps) =>
        props.shrink ? <span>{children}</span> : <>{children}</>

    return (
        <Wrapper>
            <motion.button
                type={props.type ?? "button"}
                whileTap={{ scale: 0.95 }}
                className={`${getClasses({ variant, border, disabled, defaultClasses })} ${props.className}`}
                onClick={handleClick}
                disabled={disabled}
            >
                {Icon ? <Icon className={`text-xl ${iconColor ?? 'text-current'}`} /> : null}
                <span className="flex-1">{props.children}</span>
            </motion.button>
        </Wrapper>
    )
}

function getClasses({ variant, border, disabled, defaultClasses }: ButtonProps): string {
    switch (variant) {
        case "outline":
            return `${defaultClasses} border ${border ?? 'border-gray-300'} bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600`
        case "blue":
            return `${defaultClasses} bg-blue-600 hover:bg-blue-500 text-white`
        case "green":
            return `${defaultClasses} bg-green-600 hover:bg-green-500 text-white`
        case "red":
            return `${defaultClasses} bg-red-500 hover:bg-red-400 text-white`
        case "white":
            return `${defaultClasses} bg-white text-gray-700`
        case "gray-1":
            return `${defaultClasses} bg-gray-700 text-white`
        case "gray-2":
            return `${defaultClasses} bg-gray-700/80 text-white`
        case "gray-3":
            return `${defaultClasses} bg-gray-700 bg-opacity-60 text-white`
        default:
            return `${defaultClasses} ${disabled ? "bg-gray-700" : "bg-gray-800 bg-opacity-60"} text-white`
    }
}

export function BackButton({ text = "Back", to }: { text?: string, to?: string }) {
    const router = useRouter()
    return (
        <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-6 flex text-xl items-center space-x-4 cursor-pointer text-gray-400"
            onClick={() => to?.length ? router.push(to) : router.back()}
        >
            <span className="text-5xl text-white"><FiArrowLeftCircle /></span>
            <span className="">{text}</span>
        </motion.div>
    )
}