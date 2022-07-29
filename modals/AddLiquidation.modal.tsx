import Button from '@components/Button';
import { InputWithLabel } from "@components/FormComponents";
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useDialog } from '@contexts/Dialog.context';
import { useModal } from '@contexts/Modal.context';
import { useMutate } from '@utils/fetch';
import { formatNumber, sanitizePayload } from '@utils/index';
import { useForm } from "react-hook-form";

interface _Subscription extends Omit<Subscription, 'customer'> {
   customer: Customer
}
export default function AddLiquidation({ data: subscription }: { data: _Subscription }) {
   const { closeModal } = useModal()
   const { open: openDialog } = useDialog()
   const { handleSubmit, register, formState: { errors } } = useForm<_Object>()

   const { isLoading, mutate } = useMutate({
      url: "/liquidations",
      onSuccessCallback: () => closeModal(),
      refetchKeys: [
         [queryKeys.liquidations, subscription.id],
      ],
   })

   const onSubmit = (values: Liquidation) => {
      function next() {
         if (subscription.customer) {
            const data: _Object = {
               ...values,
               deposit: subscription.id,
               customer: subscription.customer?.id,
               reference: values.reference,
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
                     {subscription.customer?.surname} {subscription.customer?.forenames.split(" ")[0]}
                  </span>
               </p>
               <p>For Fixed Deposit of {formatNumber(subscription.amount, "N")}</p>
               {/* <p className='opacity-60'>Available balance: {formatNumber(analysis.investmentBalance, "N")}</p> */}
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
