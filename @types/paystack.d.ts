
interface PaystackResponse<T> {
   status: boolean
   data: T
}

interface PaystackCustomer extends Customer {
   customer_code: string
   integration: number
   domain: string
}

interface PaystackPlan {
   id: number
   pages: any[]
   name: string
   plan_code: string
   description?: string
   amount: number
   interval: string
   invoice_limit: number
   send_invoices: boolean
   send_sms: boolean
   hosted_page: boolean
   hosted_page_url?: string
   hosted_page_summary: any
   currency: string
   migrate: boolean
   is_deleted: boolean
   is_archived: boolean
   integration: number
   createdAt: string
   updatedAt: string
   total_subscriptions: number
   active_subscriptions: number
   total_subscriptions_revenue: number
   subscriptions: PaystackSubscription[]
}

interface PaystackSubscription {
   id: number,
   customer: number,
   plan: number
   integration: number
   domain: string
   start: number
   status: string
   quantity: number,
   amount: number
   subscription_code: string
   email_token: string
   authorization: number
   easy_cron_id: string
   cron_expression: string
   next_payment_date?: string
   open_invoice?: string
   invoice_limit: number
   split_code?: string
   cancelledAt: string
   createdAt: string
   updatedAt: string
}

interface PaystackTransaction extends Transaction {
   domain: string
   message?: string
   gateway_response: string
   ip_address?: string
   metadata: {
      invoice_action: string
   }
   log?: string
   fees: number
   fees_split?: string
   authorization: {
      authorization_code: string
      bin: number
      last4: number
      exp_month: number
      exp_year: number
      channel: string
      card_type: string
      bank: string
      country_code: string
      brand: string
      reusable: boolean
      signature: string
      account_name?: string
   },
   // plan: PaystackPlan
   customer: PaystackCustomer
   paidAt: string
   createdAt: string
   requested_amount: number,
   source: {
      source: string
      type: string
      identifier?: any
      entry_point: string
   },
   pos_transaction_data?: {}
}