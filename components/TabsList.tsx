import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface Props {
   tabs: _Tab[]
   index?: number
   setIndex?: React.Dispatch<React.SetStateAction<number>>
   fullHeight?: boolean
   className?: string
}
export default function TabsList(props: Props) {
   const router = useRouter()

   useEffect(() => {
      const basePath = router.pathname.split('/').filter(r => !!r)[0]

      for (let i = 0; i < props.tabs.length; i++) {
         const route = props.tabs[i].route;
         const fullPath = route?.startsWith('/') ? route : `${basePath}/${route}`
         const isMatch = fullPath === router.pathname
         if (!!route && isMatch) {
            props.setIndex?.(i)
            break
         }
      }
   }, [router.pathname])

   return (
      <ul className={`flex w-full h-12 place-items-end ${props.className}`}>
         {
            props.tabs.map((tab, i) => {
               const selected = props.index === i

               return (
                  <li key={i}
                     className={`text-sm px-5 h-12 grid place-items-center cursor-pointer capitalize select-none
                        ${selected ? "border-b-4 border-red-500" : "opacity-60"}
                     `}
                     onClick={() => {
                        props.setIndex?.(i)
                        tab.route && router.replace(tab.route, undefined)
                     }}
                  >{tab.name}</li>
               )
            })
         }
      </ul>
   );
}

export function TabsGroup({ children }: { children: React.ReactNode }) {
   return (
      <div className="px-6 bg-white sticky top-0 left-0 shadow-xl shadow-blue-600/5 z-20 rounded-lg">
         {children}
      </div>
   )
}
