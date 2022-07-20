type _Object = Record<string, any>
interface _ModalState {
   name?: _ModalName
   data?: any,
   title?: string
}

interface _Tab {
   name: string,
   route?: string,
   element?: (args?: any) => JSX.Element
}

interface User {
   username: string
   email: string
   password: string
   confirmed: boolean
   blocked: boolean
   role: Role
}

interface Role {
   name: string
   description: string
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
   id: number
   description: string
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

interface Liquidation {
   status: 'success'
   reference: string
   amount: number
   paid_at: string
   channel: 'bank' | 'cash'
   currency: 'NGN'
   fees: number
   customer: Customer
   paid_by: User
   narration: string
   customer_code: string
   recipient_meta: RecipientMeta
}

interface RecipientMeta {
   account_name: string
   account_number: string
   bank_name: string
}

interface Transaction {
   id: string
   status: string
   reference: string
   amount: number
   paid_at: string
   created_at: string
   channel: string
   currency: string
   customer: Customer | PaystackCustomer
   [key: string]: any
}

interface _TableHeader {
   key: string,
   label?: string,
   sticky?: boolean,
   modifier?: (value: any, element?: any) => string | number | JSX.Element | null,
   cell?: (cell) => string | number | JSX.Element | null,
   cellStyle?: (element?: any) => string,
   capitalize?: boolean,
   placeholder?: string,
   selected?: boolean,
   headerStyle?: Record<string, string | number>
}