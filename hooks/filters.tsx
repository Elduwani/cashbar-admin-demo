import Button from "@components/Button"
import { InputWithLabel } from "@components/FormComponents"
import Select from "@components/Select"
import { useTimePeriod } from "@hooks/index"
import { sanitizePayload, toSelectOptions } from "@utils/index"
import React from "react"
import { useForm } from "react-hook-form"

export default function useFilters() {
   const { handleSubmit, register, setError, control, formState: { errors } } = useForm()
   const { timePeriod, element: timePeriodPicker } = useTimePeriod()

   const onSubmit = (values: _Object) => {
      const { less_than, greater_than } = values
      if (!!less_than && !!greater_than && (+less_than >= +greater_than)) {
         setError("greater_than", {
            type: "manual",
            message: `Value too low`
         }, { shouldFocus: true })
         return false
      }

      const data = { ...values, period: timePeriod.value }
      console.log(sanitizePayload(data))
   }

   const element = (
      <form
         name="filters-form"
         className="p-8 space-y-6 border rounded-lg"
         onSubmit={handleSubmit(onSubmit as any)}
      >
         <Container title="Time period">
            <div className="flex space-x-4">
               {timePeriodPicker}
            </div>
         </Container>
         <Container title="Amount range">
            <InputWithLabel
               name="less_than"
               pattern="numeric"
               errors={errors}
               register={register}
            />
            <InputWithLabel
               name="greater_than"
               pattern="numeric"
               errors={errors}
               register={register}
            />
         </Container>
         <Container title="Transaction status">
            <Select
               name="status"
               control={control}
               options={toSelectOptions<Transaction['status']>(['success', 'failed', 'abandoned'])}
               initialValue="success"
            />
         </Container>

         <Button type="submit">Apply</Button>
      </form>
   )
   return { element }
}

interface ContainerProps {
   children: React.ReactNode
   title: string
   className?: string
}
function Container(props: ContainerProps) {
   return (
      <div className={`space-y-3 last-of-type:border-0 ${props.className}`}>
         <p className="text-gray-500 uppercase tracking-wide text-xs">{props.title}</p>
         {props.children}
      </div>
   )
}
