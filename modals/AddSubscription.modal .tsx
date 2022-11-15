import Button from '@components/Button';
import { InputWithLabel } from "@components/FormComponents";
import PageTitle from '@components/PageTitle';
import Spinner from '@components/Spinner';
import { queryKeys } from '@configs/reactQueryConfigs';
import { useModal } from '@contexts/Modal.context';
import { useFetch, useMutate } from '@utils/fetch';
import { cx } from '@utils/index';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { FiCheckCircle } from 'react-icons/fi';

interface Props {
   customerID: string
}
export default function AddSubscription(props: Props) {
   const { closeModal } = useModal()
   const { handleSubmit, register, formState: { errors } } = useForm<_Object>()

   const fetcher = useFetch({
      url: `/authorizations?id=${props.customerID}`,
      key: ['authorizations', props.customerID],
      placeholderData: []
   })

   const { isLoading, mutate } = useMutate({
      url: "/expense",
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
         <PageTitle
            title='Add subscription'
            utilities={isLoading && <Spinner />}
         />
         <form
            name='add-subscription'
            onSubmit={handleSubmit(onSubmit as any)}
            className="space-y-3"
         >
            {
               fetcher.data?.length ?
                  <CardOptions
                     cards={fetcher.data}
                     setValue={() => null}
                  />
                  : null
            }
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

interface CardsProps {
   cards: PaystackTransaction['authorization'][]
   setValue: Function
}
function CardOptions(props: CardsProps) {
   const [index, setIndex] = useState(0)

   // useEffect(() => {
   //     setValue(cards[index]?.authorization_code)
   //     //eslint-disable-next-line
   // }, [index])

   return (
      <div className="space-y-3">
         <p className="capitalize text-gray-500 text-sm">
            {props.cards.length > 1 ? "Choose" : ""} payment option
         </p>
         <div className="space-y-3 p-4 bg-indigo-50 rounded-lg">
            {
               props.cards.map((card, i) => {
                  const isSelected = i == index
                  const { brand, exp_month, exp_year, last4 } = card

                  return (
                     <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className={cx(
                           "px-4 py-3 rounded-lg flex items-center space-x-4 cursor-pointer",
                           isSelected ? "bg-indigo-600 text-white shadow-lg" : "bg-gray-50 border"
                        )}
                     >
                        {
                           isSelected && <FiCheckCircle className="text-2xl text-white" />
                        }
                        <p>
                           <span className="capitalize">{brand}</span> ending in <span className="font-medium">{last4}</span>
                           <span className="block text-sm">Expires {exp_month}/{exp_year}</span>
                        </p>
                     </div>
                  )
               })

            }
         </div>
      </div>
   )
}