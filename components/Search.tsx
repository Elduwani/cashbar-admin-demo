import { getNestedValue } from '@utils/index';
import { motion } from "framer-motion";
import React, { useRef } from 'react';
import { FiSearch, FiX } from "react-icons/fi";

interface Props {
    data?: any[],
    matchList: string[],
    callback?: Function,
    label?: string,
    placeholder?: string,
    originalData?: any[]
}
export default function Search(props: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const { data, callback, label, matchList = ["amount"], placeholder } = props

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        const { value } = e.target
        if (data) {
            if (!value.length || value.length < 3) return callback?.(undefined)
            /** TODO: use a real useDebounce hook here */
            // At least 2 letters fake debounce for performance purposes
            const regex = new RegExp(value, 'gi')
            const arr = data.filter(obj =>
                //For every value in matchList return whichever matches
                matchList.some(key => {
                    if (key && key.includes(".")) {
                        let value = getNestedValue(key, obj)
                        return String(value).match(regex)
                    }
                    return String(obj[key]).match(regex)
                })
            )

            if (arr.length) return callback?.(arr)
            else console.log("Nothing found")
        }
        else console.log("data props not present")
    }

    const clearSearch = () => {
        if (ref.current) {
            ref.current.value = "";
            ref.current.focus()
        }
        callback?.(undefined)
    }

    return (
        <div className="w-full max-w-lg">
            {
                label && <label htmlFor="search"
                    className="block text-sm leading-5 font-medium text-gray-500 mb-2"
                >{label ?? "Search..."}</label>
            }
            <div className={`
                rounded-lg h-10 flex items-center overflow-hidden border border-gray-300 bg-white
                focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-opacity-80 focus-within:border-transparent
            `}>
                <span className="h-full grid place-items-center pl-4">
                    <FiSearch className="text-lg" />
                </span>
                <input
                    ref={ref}
                    type="text"
                    name="search"
                    onChange={handleSearch}
                    placeholder={placeholder ?? `Search...`}
                    className="h-10 block w-full border-transparent bg-transparent truncate border-0 focus:outline-none focus:ring-0"
                />
                {
                    <motion.span
                        initial={false}
                        onClick={clearSearch}
                        className="h-full pr-4 cursor-pointer grid place-items-center"
                        animate={{
                            x: ref.current?.value?.length ? 0 : 40,
                            opacity: ref.current?.value?.length ? 1 : 0
                        }}
                    ><FiX className="text-xl hover:text-blue-700" /></motion.span>
                }
            </div>
        </div>
    );
}