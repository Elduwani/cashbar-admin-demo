import Button from '@components/Button';
import { InputWithLabel } from "@components/FormComponents";
import PageTitle from '@components/PageTitle';
import Select from '@components/Select';
import Spinner from '@components/Spinner';
import SwitchInput from '@components/SwitchInput';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useModal } from '@contexts/Modal.context';
import { useMutate } from '@utils/fetch';
import { toSelectOptions } from '@utils/index';
import { useForm } from "react-hook-form";

const intervalOptions = ["daily", "weekly", "monthly"]

interface Props {
   plan?: Plan
}
export default function AddPlan(props: Props) {
   const { closeModal } = useModal()
   const { handleSubmit, register, control, formState: { errors }, setError } = useForm<_Object>({
      defaultValues: props.plan
   })

   const { isLoading, mutate } = useMutate({
      url: "/plans",
      method: props.plan ? 'put' : 'post',
      // onSuccessCallback: closeModal,
      refetchKeys: [queryKeys.plans],
   })

   const onSubmit = (values: _Object) => {
      // Paystack requires: name, amount,interval, description, invoice_limit, send_invoices, send_sms
      if (+values.amount < 100) {
         return setError('amount',
            { message: "Amount must be 100 or greater" },
            { shouldFocus: true }
         )
      }
      if (!isLoading) {
         mutate(values as any)
      }
   }

   return (
      <div className='w-screen max-w-lg p-12 pt-0 space-y-6'>
         <PageTitle
            title={props.plan?.name ?? 'Create a new plan'}
            utilities={isLoading && <Spinner />}
         />
         <form
            name='create-plan'
            onSubmit={handleSubmit(onSubmit as any)}
            className="space-y-4"
         >
            <InputWithLabel
               name="name"
               placeholder={props.plan?.name ?? 'Retirement plan'}
               register={register}
               errors={errors}
               required
            />
            <InputWithLabel
               name="amount"
               pattern='numeric'
               placeholder={props.plan?.amount?.toString() ?? '2,500'}
               register={register}
               errors={errors}
               required
            />
            {
               props.plan &&
               <p className='text-sm text-slate-500'>
                  This change will only apply to new subscribers. Existing subscribers will maintain their existing plan details.
               </p>
            }
            {
               //interval cannot be changed if plan is in use
               !props.plan &&
               <Select
                  control={control}
                  name="interval"
                  label="interval"
                  options={toSelectOptions(intervalOptions)}
                  register={register}
                  errors={errors}
                  required
               />
            }
            <InputWithLabel
               name="description"
               register={register}
               placeholder={props.plan?.description}
            />
            <SwitchInput
               control={control}
               name="send_invoices"
               label="send invoices"
               state={!!props.plan?.send_invoices}
            />
            <SwitchInput
               control={control}
               name="send_sms"
               label="send sms"
               state={!!props.plan?.send_sms}
            />
            <div className="grid grid-cols-2 gap-4 pt-4">
               <Button
                  disabled={isLoading}
                  variant="blue"
                  type="submit"
               >Confirm</Button>
               <Button
                  onClick={closeModal}
                  variant="outline"
               >Cancel</Button>
            </div>
         </form>
      </div>
   )
}