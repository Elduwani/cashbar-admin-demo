import { firestore } from "./firebase.server";

interface Summary {
   transactionCount: number
   investmentVolume: number
   liquidationVolume: number
}

console.log('Transactions controller called...')

export async function getSummary() {
   const investmentsRef = await firestore.collection("transactions").get()
   const liquidationsRef = await firestore.collection("liquidations").where('validated', '==', true).get()

   const invTotals = investmentsRef.docs.reduce((acc, trx) => {
      acc += trx.data().amount
      return acc
   }, 0)

   const liqTotals = liquidationsRef.docs.reduce((acc, liq) => {
      acc += liq.data().amount
      return acc
   }, 0)

   return {
      transactionCount: investmentsRef.size,
      liquidationVolume: liqTotals,
      investmentVolume: invTotals
   } as Summary

   // throw new Error("Error fetching Paystack and/or database entries")
}