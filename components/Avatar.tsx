interface Props {
   name: string
   src?: string
   className?: string
   size?: string
   textSize?: string
   onClick?: () => null
}
export default function Avatar(props: Props) {
   const initial = props.name?.substring(0, 1) ?? ''

   return (
      <div
         style={{ backgroundImage: `url("${props.src}")` }}
         className={`
            ${props.className} ${props.size ?? 'h-9 w-9'} 
            ${props.textSize ?? 'text-xl'}
            uppercase bg-teal-50 text-teal-500 flex-shrink-0
            rounded-full flex items-center justify-center bg-no-repeat bg-cover bg-center
         `}
      >{!props.src && initial}</div>
   )
}
