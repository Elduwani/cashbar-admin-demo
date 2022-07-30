
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
   id: string
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
   [key: string]: any
}

interface PaystackSubscription extends Subscription {
   customer: string,
   plan: string
   integration: number
   domain: string
   email_token: string
   authorization: number
   easy_cron_id: string
   cron_expression: string
   open_invoice?: string
   invoice_limit: number
   split_code?: string
   [key: string]: any
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
   }
   plan: string
   requested_amount: number
   [key: string]: any
}