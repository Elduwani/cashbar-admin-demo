interface Props {
    fullscreen?: boolean,
    height?: number,
    className?: string,
    children: React.ReactNode
}

export default function FullPageCenterItems({ fullscreen, height = 500, className, children }: Props) {
    return (
        <div
            style={{ height: fullscreen ? `100vh` : (height ?? `100%`) }}
            className={`flex-shrink-0 flex-1`}
        >
            <div className={`grid place-content-center h-full ${className}`}>
                {children}
            </div>
        </div>
    )

}