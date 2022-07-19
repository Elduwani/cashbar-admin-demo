import { useHydrated } from "~/hooks/useHydrated"

interface Props {
   children(): React.ReactNode
}

export default function ClientOnly(props: Props) {
   const hydrated = useHydrated()
   return hydrated ? <>{props.children}</> : null
}