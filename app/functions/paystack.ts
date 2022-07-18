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
export const getCustomers = async () => {
   const { data } = await axios.get('https://api.paystack.co/customer', { headers });
   return data as PaystackResponse<PaystackCustomer[]>
}

export const createCustomer = async (customer: Partial<PaystackCustomer>) => {
   const { data } = await axios.post('https://api.paystack.co/customer', customer, config);
   return data as PaystackResponse<PaystackCustomer>;
}

export const updateCustomer = async (data: Partial<PaystackCustomer>, id: number) => {
   const response = await axios.put(`https://api.paystack.co/customer/${id}`, data, config);
   return response.data as PaystackResponse<PaystackCustomer>;
}

/** Plans **/
export const getPlans = async () => {
   const response = await axios.get(`https://api.paystack.co/plan`, { headers });
   return response.data as PaystackResponse<PaystackPlan[]>;
}

type PlanPayload = Pick<PaystackPlan, 'name' | 'amount' | 'description' | 'send_invoices' | 'interval' | 'send_sms'>
export const createPlan = async (plan: PlanPayload) => {
   const { data } = await axios.post('https://api.paystack.co/plan', plan, config);
   return data as PaystackResponse<PaystackPlan>;
}

/** Transactions **/
export const getTransactions = async () => {
   /**
    * Only fetch successful transactions
    * Limit of 5k
    **/
   const query = `perPage=5000&status=success`
   const response = await axios.get(`https://api.paystack.co/transaction?${query}`, { headers });
   console.log(response.data.data.length)
   return response.data as PaystackResponse<PaystackTransaction[]>;
}
