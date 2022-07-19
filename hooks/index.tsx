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