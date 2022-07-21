interface Props {
   fullscreen?: boolean,
   height?: number,
   className?: string,
   children: React.ReactNode
}

export default function FullPageCenterItems(props: Props) {
   return (
      <div
         style={{ height: props.fullscreen ? `100vh` : (props.height ?? `100%`) }}
         className={`flex-shrink-0 flex-1`}
      >
         <div className={`grid place-content-center h-full ${props.className}`}>
            {props.children}
         </div>
      </div>
   )

}