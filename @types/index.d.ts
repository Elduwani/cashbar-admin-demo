declare module 'react-csv';
declare module 'uuid';

type _Object<T = any> = Record<string, T>

interface _Tab {
   name: string
   route?: string
   onClick?(): any
   element?: (args?: any) => JSX.Element
}

interface User {
   id: string
   username: string
   email: string
   password: string
   confirmed: boolean
   blocked: boolean
   role: Role
}

interface Role {
   name: string
   description?: string
}

interface Customer {
   id: string,
   first_name: string
   last_name: string
   email: string
   phone: string
   metadata: {
      gender: string
      state: string
      date_of_birth: string
      address: string
   },
   created_at: string
   updated_at: string
   [key: string]: any
}

interface Expense {
   id: string
   narration: string
   amount: number
   paid_at: string
   channel: string
   reference: string
   category: string
   paid_by: User
   status: 'success'
   validated: boolean,
   recipient_meta?: RecipientMeta
   created_by: User
   updated_by: User
   created_at: string
   updated_at: string
}

interface DBExpense extends Expense {
   paid_by: string
   created_by: string
   updated_by: string
}

interface Liquidation extends Transaction {
   fees: number
   plan: Plan
   paid_by: User
   narration: string
   customer_code: string
   recipient_meta: RecipientMeta
}

interface DBLiquidation extends Liquidation {
   plan: string
   paid_by: string
}

interface RecipientMeta {
   account_name: string
   account_number: string
   bank_name: string
}

interface Transaction {
   id: string
   status: 'success' | 'failed' | 'abandoned'
   reference: string
   amount: number
   paid_at: string
   created_at: string
   channel: string
   currency: string
   customer: Customer
   plan?: PaystackPlan
   is_liquidation?: boolean
   // [key: string]: any
}

interface DBTransaction extends Transaction {
   customer: string
}

interface Subscription {
   id: string,
   customer: Customer,
   plan: PaystackPlan
   start: number
   status: 'active' | 'complete' | 'cancelled'
   quantity: number,
   amount: number
   subscription_code: string
   next_payment_date?: string
   cancelledAt: string
   createdAt: string
   updatedAt: string
   // [key: string]: any
}

interface DBSubscription extends Subscription {
   customer: string
   plan: string
}

interface Plan extends PaystackPlan {

}

interface _TableColumn<T> {
   key: keyof T,
   label?: string,
   sticky?: boolean,
   modifier?: (element?: any, index?: number) => string | number | JSX.Element | null,
   cell?: (cell) => string | number | JSX.Element | null,
   cellStyle?: (element?: any) => string,
   capitalize?: boolean,
   placeholder?: string,
   selected?: boolean,
   headerStyle?: Record<string, string | number>
}

type CollectionName = "transactions" | "customers" | "expenses" | "liquidations" | "plans" | "subscriptions"

type _AddedByMetaTag = Pick<User, 'email' | 'id' | 'role'> & {
   timestamp: string
} 