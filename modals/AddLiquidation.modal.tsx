import Button from '@components/Button';
import { InputWithLabel } from "@components/FormComponents";
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useDialog } from '@contexts/Dialog.context';
import { useModal } from '@contexts/Modal.context';
import { useMutate } from '@utils/fetch';
import { formatNumber, sanitizePayload } from '@utils/index';
import { useForm } from "react-hook-form";

interface FormInput {
   amount: string
   paid_at: string
   charges: string
   interest_payout: string
}
interface _Subscription extends Omit<PaystackSubscription, 'customer'> {
   customer: Customer
}
interface Props {
   subscription: _Subscription
   cancel?(): void
}
export default function AddLiquidation(props: Props) {
   const { closeModal } = useModal()
   const { open: openDialog } = useDialog()
   const { handleSubmit, register, formState: { errors } } = useForm<FormInput>()

   const { isLoading, mutate } = useMutate({
      url: "/liquidations",
      onSuccessCallback: () => closeModal(),
      refetchKeys: [
         [queryKeys.liquidations, props.subscription.id],
      ],
   })

   const onSubmit = (values: FormInput) => {
      function next() {
         if (props.subscription.customer) {
            const data: _Object = {
               ...values,
               deposit: props.subscription.id,
               customer: props.subscription.customer?.id,
            }
            sanitizePayload(data)
            if (!isLoading) mutate({ data } as any)
         }
      }

      if (true) {
         openDialog({
            accept: next,
            message: `
               Only ${formatNumber(values.amount)} of this investment can be liquidated.\n
               A liquidation of ${formatNumber(values.amount)} will lead to an overdraft.\n
               Do you want to continue?
            `,
            buttons: {
               accept: {
                  text: `Yes, Continue`
               },
               decline: {
                  text: 'Cancel'
               }
            }
         })
      } else {
         next()
      }

      console.log("Customer is undefined");
   }

   return (
      <>
         {
            isLoading && <Spinner />
         }
         <form
            name='add-liquidation'
            onSubmit={handleSubmit(onSubmit as any)}
            className="w-[80%] mx-auto p-8 pt-2 space-y-4"
         >
            <div className="space-y-1 pb-4">
               <p className="text-xl">
                  Adding liquidation for <span className="capitalize font-medium">
                     {/* {subscription.customer?.surname} {subscription.customer?.forenames.split(" ")[0]} */}
                  </span>
               </p>
               <p>For {props.subscription.plan.interval} subscription of {formatNumber(props.subscription.amount, "N")}</p>
               <p className='opacity-60'>Available balance: 0 balance</p>
            </div>
            <InputWithLabel
               name="amount"
               pattern="numeric"
               placeholder="155000"
               register={register}
               errors={errors}
               required
            />
            <InputWithLabel
               name="paid_at"
               type="date"
               label="liquidation date"
               register={register}
               errors={errors}
               required
            />
            <InputWithLabel
               name="liquidation_charges"
               pattern="numeric"
               register={register}
               errors={errors}
               required
            />
            <InputWithLabel
               name="wht_deduction"
               pattern="numeric"
               register={register}
               errors={errors}
            />
            <InputWithLabel
               name="charges"
               pattern="numeric"
               register={register}
               errors={errors}
            />
            <InputWithLabel
               name="interest_payout"
               pattern="numeric"
               register={register}
               errors={errors}
            />
            <div className="grid grid-cols-2 gap-4 pt-6">
               <Button disabled={isLoading} variant="blue" type="submit">Add liquidation</Button>
               <Button onClick={closeModal} variant="outline" type="reset">Cancel</Button>
            </div>
         </form>
      </>
   )
}
