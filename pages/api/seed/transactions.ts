import { linkTransactionsToPlans, seedTransactions, verifyHeaders } from "@controllers/seed.server"
import { NextApiRequest, NextApiResponse } from "next/types"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   try {
      verifyHeaders(req)

      switch (req.method) {
         case "POST": {
            const response = await seedTransactions()
            return res.json(response);
         }

         case "PUT": {
            const response = await linkTransactionsToPlans()
            return res.send(response)
         }

         /**
          * 
            case "PATCH": {
               // const transactions = await getPaystackTransactions()
   
               fs.readFile(verifiedFileLocation, 'utf8', (err, content) => {
                  if (err) {
                     return console.error(err)
                  }
   
                  const data = JSON.parse(content) as _Object<PaystackTransaction>
   
                  // transactions.data.forEach(tr => {
                  //    if (data[tr.id]) {
                  //       //@ts-ignore
                  //       data[tr.id].customer = String(tr.customer.id)
                  //    }
                  // })
   
                  for (const key in data) {
                     const trx = data[key]
                     trx.id = String(trx.id)
                     trx.plan = String(trx.plan)
                     data[key] = trx
                  }
   
                  console.log('>> Writing to file <<')
                  fs.writeFileSync(
                     verifiedFileLocation,
                     JSON.stringify(data, null, 2),
                     { encoding: 'utf8', flag: 'w+' }
                  )
               })
   
               return res.send("OK")
            }
          */


         default: {
            return res.status(500).json("Invalid request method")
         }
      }

   } catch (error: any) {
      console.log(error.message)
      return res.status(400).send(`error.message. \n ${error.message}`)
   }
}
