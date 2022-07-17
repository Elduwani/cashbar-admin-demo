import { RiLoader5Fill } from "react-icons/ri";

export default function Spinner({ scale, size = "text-5xl", color = `text-indigo-600` }) {

    return <RiLoader5Fill className={`animate-spin ${color} ${scale ? scale : size}`} />
}

export function SpinnerWithText({ text, size, color, row }) {
    return (
        <div className={`flex items-center ${row ? "space-x-6" : "flex-col space-y-4"}`}>
            <Spinner size={size} color={color} />
            <p>{text}</p>
        </div>
    )
}

export function SwingIndicator() {
    return (
        <div className="w-full overflow-hidden absolute -bottom-1 left-0">
            <div className="h-1 w-full animateSwing">
                <span className="bar h-full bg-red-500 block"></span>
            </div>
        </div>
    )
}
