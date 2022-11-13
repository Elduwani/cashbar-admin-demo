import { Switch } from "@headlessui/react";
import { cx } from "@utils/index";
import { useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";

interface Props {
   state: boolean
   name: string
   height?: number
   label?: string
   setValue?: (a: any) => void
   activeColor?: string
   idleColor?: string
   control?: Control<any, any>,
}
export default function SwitchInput({ activeColor = 'bg-indigo-500', idleColor = 'bg-slate-300', height = 25, ...props }: Props) {
   const { control: ctrl } = useForm()
   const [isChecked, setIsChecked] = useState(!!props.state)
   const offset = 5

   return (
      <Controller
         name={props.name}
         control={props.control ?? ctrl}
         defaultValue={isChecked}
         render={({ field: { onChange } }) =>
            <Switch.Group
               as="div"
               className="flex items-center justify-between py-2 border border-slate-300 px-4 rounded-md h-11"
            >
               {
                  props.label &&
                  <Switch.Label className={"capitalize text-sm opacity-60"}>
                     {props.label}
                  </Switch.Label>
               }
               <Switch
                  as="button"
                  checked={isChecked}
                  onChange={(e: boolean) => {
                     onChange(e)
                     setIsChecked(e)
                     props.setValue?.(e)
                  }}
                  style={{ height, width: height * 2 }}
                  className={cx(
                     `${isChecked ? activeColor : idleColor} relative inline-flex`,
                     `flex-shrink-0 transition-colors duration-200 ease-in-out`,
                     `border-2 border-transparent rounded-full cursor-pointer`,
                     `focus:outline-none focus:shadow-outline`
                  )}
               >
                  {({ checked }) => (
                     <span
                        className={`inline-block transition duration-200 ease-in-out bg-white rounded-full`}
                        style={{
                           height: height - offset,
                           width: height - offset,
                           transform: `translateX(${checked ? height : 0}px)`
                        }}
                     />
                  )}
               </Switch>
            </Switch.Group>
         }
      />
   )
}