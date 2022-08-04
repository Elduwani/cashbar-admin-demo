interface Props {
    title: string
    subtitle?: string
    color?: string
}
export default function PageTitle(props: Props) {
    return (
        <div className="border-b h-20 flex flex-col text-gray-700 py-8">
            <h1 className={`
                text-3xl font-bold tracking-tighter leading-tight md:leading-none capitalize
                ${props.color}
            `}>
                {props.title}
            </h1>
            {
                props.subtitle &&
                <p className="">{props.subtitle}</p>
            }
        </div>
    )
}
