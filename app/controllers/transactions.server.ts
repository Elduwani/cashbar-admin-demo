// import db from "./firebase.server";


// interface Summary {
//    transactionCount: number
//    investmentVolume: number
//    liquidationVolume: number
// }
// let count = 0

// export async function getSummary() {
//    count++
//    console.log(count)

//    const investmentsRef = collection(db, "transactions");
//    // const liquidationsRef = query(collection(db, "liquidations"), where('validated', '==', true));
//    const invSnapshot = await getDocs(investmentsRef)
//    // const liqSnapshot = await getDocs(liquidationsRef)

//    const invTotals = invSnapshot.docs.reduce((acc, trx) => {
//       acc += trx.data().amount
//       return acc
//    }, 0)

//    // const liqTotals = liqSnapshot.docs.reduce((acc, liq) => {
//    //    acc += liq.data().amount
//    //    return acc
//    // }, 0)

//    return {
//       // transactionCount: invSnapshot.size,
//       // liquidationVolume: liqTotals
//       investmentVolume: invTotals,
//       transactionCount: 3922,
//       liquidationVolume: 9276554
//    }
//    // throw new Error("Error fetching Paystack and/or database entries")
// }