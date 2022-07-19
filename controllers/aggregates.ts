import { firestore, mapDataId } from "@controllers/firebase.server";
import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";

interface Aggregate {
   expenseVolume: number
   investmentVolume: number
   liquidationVolume: number
   transactionCount: number
   customerCount: number
   data: {
      revenue: Transaction[]
      liquidations: Liquidation[]
      expenses: Expense[]
   }
}

export default async function getAggregate(): Promise<Aggregate> {
   const revenueRef = await firestore.collection("transactions").get()
   const liquidationsRef = await firestore.collection("liquidations").where('validated', '==', true).get()
   const customerssRef = await firestore.collection("customers").get()

   const invTotals = sumAmount(revenueRef.docs)
   const liqTotals = sumAmount(liquidationsRef.docs)

   const responseData: Aggregate = {
      transactionCount: revenueRef.size,
      customerCount: customerssRef.size,
      liquidationVolume: liqTotals,
      investmentVolume: invTotals,
      expenseVolume: 0,
      data: {
         expenses: [],
         liquidations: liquidationsRef.docs.map(mapDataId) as Liquidation[],
         revenue: revenueRef.docs.map(mapDataId) as Transaction[],
      }
   }

   return responseData
}

function sumAmount(docs: QueryDocumentSnapshot<DocumentData>[]) {
   return docs.reduce((acc, liq) => {
      //All amounts are in the lowest denomination [kobo, cents]
      acc += liq.data().amount / 100
      return acc
   }, 0)
}