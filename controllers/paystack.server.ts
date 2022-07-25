import axios from 'axios';

const headers = { 'Authorization': `Bearer ${process.env.PAYSTACK_API_KEY}` }
// IMPORTANT! Config object comes last in the axios arguments
const config = {
   headers: {
      ...headers,
      'Content-Type': 'application/json;charset=UTF-8',
      "Access-Control-Allow-Origin": "*",
   },
}

/** Customers **/
export async function getPaystackCustomers() {
   const { data } = await axios.get('https://api.paystack.co/customer', { headers });
   return data as PaystackResponse<PaystackCustomer[]>
}

export async function createPaystackCustomer(customer: Partial<PaystackCustomer>) {
   const { data } = await axios.post('https://api.paystack.co/customer', customer, config);
   return data as PaystackResponse<PaystackCustomer>;
}

export async function updatePaystackCustomer(data: Partial<PaystackCustomer>, id: number) {
   const response = await axios.put(`https://api.paystack.co/customer/${id}`, data, config);
   return response.data as PaystackResponse<PaystackCustomer>;
}

/** Plans **/
export async function getPaystackPlans<T = PaystackPlan>() {
   const response = await axios.get(`https://api.paystack.co/plan`, { headers })
   const filteredPlans = (response.data.data as PaystackPlan[]).filter(p => !p.is_deleted && !p.is_archived)
   response.data.data = filteredPlans
   return response.data as PaystackResponse<T[]>;
}

type PlanPayload = Pick<PaystackPlan, 'name' | 'amount' | 'description' | 'send_invoices' | 'interval' | 'send_sms'>
export async function createPaystackPlan(plan: PlanPayload) {
   const { data } = await axios.post('https://api.paystack.co/plan', plan, config);
   return data as PaystackResponse<PaystackPlan>;
}

/** Transactions **/
export async function getPaystackTransactions() {
   /**
    * Only fetch successful transactions, 
    * with limit of 10k (Paystack response uncertain)
    **/
   console.log('>> Fetching paystack transactions <<')
   const query = `perPage=10000&status=success`
   const response = await axios.get(`https://api.paystack.co/transaction?${query}`, { headers });
   console.log(response.data.data.length)
   return response.data as PaystackResponse<PaystackTransaction[]>;
}

export async function verifyPaystackTransaction(reference: string) {
   const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers });
   return response.data as PaystackResponse<PaystackTransaction>;
}

/** Subscriptions **/
export async function getPaystackSubscriptions() {
   const response = await axios.get(`https://api.paystack.co/subscription`, { headers });
   return response.data as PaystackResponse<PaystackSubscription[]>;
}

/**
 * TODO:
 * Write webhooks
 */