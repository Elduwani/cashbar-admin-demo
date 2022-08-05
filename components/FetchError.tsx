import FullPageCenterItems from "./FullPageCenterItems";
import Button from "./Button";

interface Props {
   error?: any,
   refetch: (a?: any) => void,
   text?: string
}
export default function FetchError({ error, refetch, text = "retry" }: Props) {
   const message = error?.response?.statusText

   return (
      <FullPageCenterItems>
         <div className="space-y-6 text-center flex flex-col items-center text-red-600">
            <div className="co">
               <p>There was a problem</p>
               <p className="block">Server responded with - <span className="">{message}</span></p>
            </div>
            <Button variant="blue" onClick={refetch}>{text}</Button>
         </div>
      </FullPageCenterItems>
   )
}
