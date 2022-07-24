import { firestore, formatDocumentAmount } from "@controllers/firebase.server";
import { formatBaseCurrency } from "@utils/index";
import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

interface Aggregate {
   expenseVolume: number
   investmentVolume: number
   liquidationVolume: number
   transactionCount: number
   customerCount: number
   data?: {
      revenue: Transaction[]
      liquidations: Liquidation[]
      expenses: Expense[]
   }
}

export async function getAggregate(): Promise<Aggregate> {
   console.log(`** Fetching records **`)
   const revenueRef = await firestore.collection("transactions").get()
   const liquidationsRef = await firestore.collection("liquidations").where('validated', '==', true).get()
   const customerssRef = await firestore.collection("customers").get()

   const invTotals = sumAmount(revenueRef.docs)
   const liqTotals = sumAmount(liquidationsRef.docs)

   const responseData: Aggregate = {
      transactionCount: revenueRef.size,
      customerCount: customerssRef.size,
      liquidationVolume: formatBaseCurrency(liqTotals),
      investmentVolume: formatBaseCurrency(invTotals),
      expenseVolume: formatBaseCurrency(0),
      // data: {
      //    expenses: [],
      //    liquidations: liquidationsRef.docs.map(mapDataId) as Liquidation[],
      //    revenue: revenueRef.docs.map(mapDataId) as Transaction[],
      // }
   }

   return responseData
}

export async function getCustomerAggregate(customerID: string) {
   console.log(`>> Fetching aggregates for ${customerID}... <<`)
   const collectionName: Collection = 'transactions'
   const ref = firestore.collection(collectionName)
   const snapshot = await ref
      .orderBy('paid_at', 'desc')
      .where('customer', '==', +customerID)
      .get()
   const transactions = snapshot.docs.map(d => formatDocumentAmount(d))
   const total_investment = snapshot.docs.reduce((acc, curr) => acc += curr.data().amount, 0)
   const total_liquidation = 0

   return {
      total_investment: formatBaseCurrency(total_investment),
      total_interest: formatBaseCurrency(0), //TODO
      total_liquidation: formatBaseCurrency(total_liquidation),
      startDate: new Date().toISOString(),
      balance: formatBaseCurrency(total_investment - total_liquidation), //TODO minus liquidation
      transactions,
      liquidations: []
   }
}

function sumAmount(docs: QueryDocumentSnapshot<DocumentData>[]) {
   return docs.reduce((acc, liq) => {
      //All amounts are in the lowest denomination [kobo, cents]
      acc += liq.data().amount
      return acc
   }, 0)
}