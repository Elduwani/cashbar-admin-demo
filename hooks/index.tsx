import { getTimePeriodDate, timePeriodOptions } from "@utils/chart.utils";
import { useEffect, useState } from "react";

export default function useMedia(
   queries: string[],
   values: string[],
   defaultValue: string
) {
   // Array containing a media query list for each query
   const mediaQueryLists = typeof window !== 'undefined' ? queries.map(q => window.matchMedia(q)) : []
   // Function that gets value based on matching media query
   function getValue() {
      // Get index of first media query that matches
      const index = mediaQueryLists?.findIndex(mql => mql.matches);
      // Return related value or defaultValue if none
      return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
   }

   // State and setter for matched value
   const [value, setValue] = useState(getValue);

   useEffect(() => {
      // Event listener callback
      // Note: By defining getValue outside of useEffect we ensure that it has ...
      // ... current values of hook args (as this hook only runs on mount/dismount).
      const handler = () => setValue(getValue);
      // Set a listener for each media query with above handler as callback.
      mediaQueryLists.forEach(mql => mql.addListener(handler));
      // Remove listeners on cleanup
      return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
      //eslint-disable-next-line
   }, []) // Empty array ensures effect is only run on mount and unmount

   return value
}

type ScreenSize = "lg" | "md" | "sm" | "xs"
export function useScreenSize() {
   return useMedia(
      // Media queries
      ['(min-width: 1024px)', '(min-width: 768px)', '(min-width: 640px)', '(min-width: 360px)'],
      // Column counts (relates to above media queries by array index)
      ["lg", "md", "sm", "xs"],
      // Default column count
      "xs"
   ) as ScreenSize
}

export function tableRowStatus(status?: boolean) {
   const color = status ? "bg-green-500" : "bg-gray-200"
   return (
      <div className={`block w-4 h-4 rounded-full bg-opacity-20 ${color} grid place-items-center`}>
         <span className={`rounded-full h-2/4 w-2/4 ${color}`}></span>
      </div>
   )
}

export function useTimePeriod(
   styles?: { default: string, selected: string, deselected: string }
) {
   const [timePeriod, setState] = useState(getTimePeriodDate(timePeriodOptions[0]))
   styles = styles ?? {
      default: `w-full uppercase text-xs md:text-sm px-4 py-1 tracking-wider cursor-pointer rounded text-center`,
      selected: `bg-indigo-600 text-white shadow-lg`,
      deselected: `bg-blue-50 text-indigo-600`
   }
   const element = (
      timePeriodOptions.map(dateRange => {
         const selected = timePeriod.label === dateRange
         return (
            <div
               key={dateRange}
               className={`${styles?.default} ${selected ? styles?.selected : styles?.deselected}`}
               onClick={() => {
                  if (timePeriod.label !== dateRange) {
                     setState((getTimePeriodDate(dateRange)))
                  }
               }}
            >{dateRange.replace(/ /g, "").slice(0, 2)}</div>
         )
      })
   )

   return { timePeriod, element }
}