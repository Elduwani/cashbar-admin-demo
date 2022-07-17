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

interface PaystackCustomer {
   integration: number
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
   domain: string
   customer_code: string
   risk_action: string
   id: number,
   createdAt: string
   updatedAt: string
   [key: string]: any
}

interface PaystackResponse<T> {
   status: boolean
   data: T
}

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