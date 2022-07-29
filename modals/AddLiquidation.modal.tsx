import Button from '@components/Button';
import { InputWithLabel } from "@components/FormComponents";
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useDialog } from '@contexts/Dialog.context';
import { useModal } from '@contexts/Modal.context';
import { PostLiquidationSchema } from '@controllers/schemas.server';
import { useMutate } from '@utils/fetch';
import { formatNumber, sanitizePayload } from '@utils/index';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { z } from 'zod';

type FormInput = z.infer<typeof PostLiquidationSchema>

interface Props {
   subscription: Subscription
   cancel?(): void
}
export default function AddLiquidation(props: Props) {
   const router = useRouter()
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
            let data: FormInput = {
               ...values,
               amount: +values.amount,
               fee: values.fee ? +values.fee : undefined,
               interest_payout: values.interest_payout ? +values.interest_payout : undefined,
               plan: props.subscription.plan.id,
               customer: router.query.customer_id as string,
            }
            sanitizePayload(data)
            if (!isLoading) mutate(data as any)
         }
      }

      if (false) {
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
               placeholder="Enter liquidation amount"
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
               name="fee"
               pattern="numeric"
               placeholder="Enter fee amount"
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
