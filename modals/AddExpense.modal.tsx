import Button from '@components/Button';
import { InputWithLabel } from "@components/FormComponents";
import PageTitle from '@components/PageTitle';
import Select from '@components/Select';
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useModal } from '@contexts/Modal.context';
import { useMutate } from '@utils/fetch';
import { useForm } from "react-hook-form";

export default function AddExpense() {
   const { closeModal } = useModal()
   const { handleSubmit, register, control, formState: { errors }, reset: resetForm } = useForm<_Object>()

   const { isLoading, mutate } = useMutate({
      url: "/expenses",
      onSuccessCallback: closeModal,
      refetchKeys: [queryKeys.expenses, queryKeys.aggregates],
   })

   const onSubmit = (values: _Object) => {
      const created_by = {
         email: 'admin@email.com',
         role: 'Admin'
      }
      const payload = {
         ...values,
         created_by,
         paid_by: created_by,
         amount: parseFloat(values.amount),
      }

      if (!isLoading) {
         mutate(payload as any)
      }
   }

   return (
      <div className='w-screen max-w-lg p-12 pt-0 space-y-6'>
         <PageTitle title='Add expense' utilities={isLoading && <Spinner />} />
         <form
            name='add-expense'
            onSubmit={handleSubmit(onSubmit as any)}
            className="space-y-3"
         >
            <InputWithLabel
               name="amount"
               pattern='numeric'
               register={register}
               errors={errors}
               required
            />
            <InputWithLabel
               name="paid_at"
               type="date"
               register={register}
               errors={errors}
               required
            />
            <Select
               control={control}
               type="category"
               name="category"
               label="category"
               register={register}
               errors={errors}
               required
            />
            <Select
               control={control}
               type="channel"
               name="channel"
               label="channel"
               register={register}
               errors={errors}
               required
            />
            <InputWithLabel
               name="narration"
               register={register}
               errors={errors}
               required
            />
            <div className="grid grid-cols-2 gap-4 pt-4">
               <Button disabled={isLoading} variant="blue" type="submit">Confirm</Button>
               <Button onClick={closeModal} variant="outline" type="reset">Cancel</Button>
            </div>
         </form>
      </div>
   )
}