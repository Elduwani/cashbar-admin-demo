import { getNestedValue } from "@utils/index"
import { createElement } from "react"
import { UseFormRegister, ValidationRule } from "react-hook-form"

export const validationPatterns = {
   "numeric": {
      value: /^[0-9]+(\.[0-9]{1,2})?$/,
      message: "Enter valid numbers only"
   },
   "email": {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: "Invalid Email Address"
   },
   "phone": {
      value: /^[-+]?[0-9]+$/,
      message: "Invalid phone number format"
   },
}

export interface InputProps<T = _Object> {
   name: string
   defaultValue?: string | number | readonly string[] | undefined
   value?: string | number
   type?: string
   onChange?: (e?: any) => void
   className?: string
   placeholder?: string
   maxLength?: number
   required?: boolean
   pattern?: keyof typeof validationPatterns
   register?: UseFormRegister<T>
   errors?: _Object
   fontSize?: string
   textarea?: boolean
   readOnly?: boolean
}
export function Input(props: InputProps) {
   const error = props.errors ? getNestedValue(props.name, props.errors) : {}

   return (
      <input
         name={props.name}
         type={props.type ?? "text"}
         value={props.value}
         onChange={props.onChange}
         defaultValue={props.defaultValue}
         placeholder={props.placeholder}
         maxLength={props.maxLength}
         readOnly={props.readOnly}
         // pattern={pattern}
         className={`
                focus:ring focus:ring-blue-600 focus:ring-opacity-80 focus:border-transparent 
                ${error[props.name] && "error"} border border-gray-400 ${props.className}
            `}
         {...props.register?.(props.name, {
            //Pattern takes an object. !Must also default to empty object
            pattern: props.pattern ? validationPatterns[props.pattern] : {} as ValidationRule<RegExp>,
            required: props.required ? "This field is required" : false,
            maxLength: props.maxLength,
         })}
      />
   )
}

export interface InputWithLabelProps extends InputProps {
   label?: string,
   showLabel?: boolean,
   capitalize?: boolean,
   validation?: {
      value: RegExp,
      message: string
   }
}
export function InputWithLabel(props: InputWithLabelProps) {
   const label = props.label ?? props.name?.replace?.(/[\W_]+/g, " ")
   const error = props.errors ? getNestedValue(props.name, props.errors) : {}

   return (
      <div className="space-y-2 w-full" key={label + props.name}>
         <label htmlFor={props.name} className={`flex items-center justify-between text-sm`}>
            <span className={`text-gray-600 ${props.capitalize ? "uppercase" : "capitalize"}`}>{label}{props.required && '*'}</span>
            {
               error?.message &&
               <span className="inline-block text-red-600 text-xs text-right">{error.message}</span>
            }
         </label>
         {
            createElement(props.textarea ? "textarea" : 'input', {
               name: props.name,
               autoComplete: "off",
               type: props.type ?? "text",
               defaultValue: props.defaultValue,
               placeholder: props.placeholder,
               value: props.value,
               readOnly: props.readOnly,
               onChange: props.onChange,
               className: `
                        focus:ring focus:ring-blue-600 focus:ring-opacity-80 focus:border-transparent 
                        ${error?.message && "error"} border border-gray-400 ${props.className}
                    `,
               ...props.register?.(props.name, {
                  //@ts-ignore
                  pattern: props.pattern ? validationPatterns[props.pattern] : {} as ValidationRule<RegExp>,
                  required: !!props.required ? "This field is required" : false,
               })

            }
            )
         }
      </div>
   )
}