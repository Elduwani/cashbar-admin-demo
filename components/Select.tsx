import { Listbox, Transition } from '@headlessui/react'
import { toSelectOptions } from "@utils/index"
import { statesList } from "@utils/statesList"
import { Fragment, useEffect, useState } from "react"
import { Control, Controller, FieldValues, useForm } from "react-hook-form"
import { FiCheck, FiChevronDown as ArrowDownIcon } from 'react-icons/fi'
import banksList from "@utils/banksList"

export interface _SelectInputOption { label?: string, value: string | number | null }

export interface SelectProps {
   name: string
   label?: string
   required?: boolean
   initialValue?: string | number
   initialOptions?: _SelectInputOption[]
   type?: "dates" | "category" | "states" | "banks" | "channel" | "gender" | "facility_type" | "bank_account_type"
   register?: (name: string, options: _Object) => void
   control?: Control<FieldValues, object>
   errors?: _Object
   setValue?: (a: any) => void
   direction?: 'down' | 'up'
   align?: 'left' | 'right'
   zIndex?: string
   style?: _Object
   roundedFull?: boolean
}
export default function Select(props: SelectProps) {
   const { control: ctrl } = useForm()
   const errors = props.errors ?? {}
   const { direction = 'down', align = 'left' } = props
   const options = props.initialOptions ?? optionsList(props.type)

   const [selectedOption, setSelectedOption] = useState<_SelectInputOption | undefined>(() => {
      if (!props.initialValue) return
      return options.find(op => props.initialValue === op.value)
   })

   useEffect(() => {
      if (selectedOption?.value) {
         props.setValue?.(selectedOption.value)
      }
   }, [selectedOption])

   return (
      <div className={`relative`} style={props.style}>
         <Controller
            name={props.name}
            control={props.control ?? ctrl}
            defaultValue={props.initialValue}
            rules={{
               validate: value => {
                  if (!props.required) return true
                  if (typeof value === 'undefined' || !value?.length) {
                     return 'This field is required'
                  }
               }
            }}
            render={({ field: { onChange } }) =>
               <Listbox
                  value={selectedOption}
                  onChange={e => {
                     onChange(e?.value)
                     setSelectedOption(e)
                  }}>
                  {({ open }) => (
                     <>
                        {
                           props.label &&
                           <Listbox.Label className="flex justify-between text-sm text-gray-600 mb-2 space-x-2">
                              <span className='capitalize'>{props.label}{props.required ? '*' : ''}</span>
                              {
                                 errors[props.name] &&
                                 <span className="inline-block text-red-600 text-xs text-right truncate">
                                    {errors[props.name].message}
                                 </span>
                              }
                           </Listbox.Label>
                        }

                        <span className={`inline-block shadow-sm rounded-lg w-full`}>
                           <Listbox.Button className={`
                                        w-full h-10 ${props.roundedFull ? 'rounded-full' : 'rounded-lg'} menu-button px-3 flex items-center justify-between 
                                        cursor-default capitalize border text-left text-base focus:outline-none focus:shadow-outline-blue space-x-2
                                        focus:ring-4 focus:ring-blue-600 focus:ring-opacity-80 border-gray-400 focus:border-transparent bg-white`
                           }>
                              {
                                 //show name for empty selection
                                 !props.initialValue && !(selectedOption?.label || selectedOption?.value) ?
                                    <span className="truncate text-gray-500 text-sm">{`Select ${props.name}`}</span>
                                    :
                                    <span className="truncate ">
                                       {selectedOption?.label ?? selectedOption?.value}
                                    </span>
                              }
                              <ArrowDownIcon className="text-gray-400 w-6 h-6" />
                           </Listbox.Button>
                        </span>

                        <Transition
                           show={open}
                           leave="transition ease-in duration-100"
                           leaveFrom="opacity-100"
                           leaveTo="opacity-0"
                           className="absolute w-full rounded-md shadow-lg"
                        >
                           <Listbox.Options className={`bg-white w-full min-w-fit max-h-60 border
                                        oveflow-x-hidden focus:outline-none overflow-y-auto scrollbar 
                                        rounded-md flex flex-col shadow-lg absolute right-0 z-[50]
                                        ${direction === 'up' ? 'bottom-12' : 'top-2'}
                                        ${align === 'left' ? 'left-0' : 'right-0'}
                                    `}>
                              {
                                 options.map((option, i) => {
                                    const isSelected = selectedOption?.value === option.value
                                    const value = option.label ?? option.value
                                    /* Use the `active` state to conditionally style the active option. */
                                    /* Use the `selected` state to conditionally style the selected option. */
                                    return <Listbox.Option as={Fragment} key={i} value={option}>
                                       {({ active }) => (
                                          <div className={`menu-item flex items-center space-x-2 px-4 py-2 md:py-3 cursor-default select-none
                                                            ${active && !isSelected ? "bg-blue-50" : ""} ${isSelected && "bg-blue-600 text-white"}  
                                                        `}>
                                             <span className="w-5">
                                                {isSelected ? <FiCheck className="text-lg" /> : null}
                                             </span>
                                             <span className={`block truncate text-sm capitalize ${isSelected && "font-medium"}`}>
                                                {value}
                                             </span>
                                          </div>
                                       )}
                                    </Listbox.Option>
                                 })
                              }
                           </Listbox.Options>
                        </Transition>
                     </>
                  )}
               </Listbox>
            }
         />
      </div>
   )
}

export function optionsList(type?: SelectProps["type"]): _SelectInputOption[] {
   switch (type) {
      case "dates": return [
         { value: 7, label: `Last 7 Days` },
         { value: 14, label: `Last 14 Days` },
         { value: 30, label: `Last 30 Days` },
         { value: 190, label: `Last 90 Days` },
         { value: "week", label: `This Week` },
         { value: "month", label: `This Month` },
         { value: "year", label: `This Year` },
      ]
      case "states": return toSelectOptions(statesList)
      case "banks": return toSelectOptions(banksList, (val) => val.name)
      case "bank_account_type": return [
         { value: 'savings' },
         { value: 'current' },
         { value: 'corporate' },
      ]
      case "category": return [
         { value: "official" },
         { value: "personal" },
         { value: "mobility" },
         { value: "tools" },
         { value: "fees" },
         { value: "utility" },
         { value: "miscellanous" },
      ]
      case "channel": return [
         { value: "bank" },
         { value: "card" },
         { value: "cash" },
      ]
      case "facility_type": return [
         { label: "lendo finance", value: "LF" },
         { value: "RAF" },
         { value: "SLBB" },
      ]
      case "gender": return [
         { value: "M", label: "Male" },
         { value: "F", label: "Female" },
      ]
      default: return []
   }
}
