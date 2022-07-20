import { useEffect, useState } from "react"

interface Props {
   children: React.ReactNode
   fallback: React.ReactNode
}

export default function ClientOnly(props: Props) {
   const [state, setState] = useState(false)

   useEffect(() => {
      setState(true)
   }, [])

   return (
      <>
         {state ? props.children : props.fallback}
      </>
   )
}