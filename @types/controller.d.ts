interface _SubscriptionHistory {
   transactions: PaystackTransaction[]
   transaction_volume: number
   startDate?: string
   lastPaymentDate?: string
}

interface AllAggregates {
   expenseVolume: number
   investmentVolume: number
   liquidationVolume: number
   transactionCount: number
   customerCount: number
}

interface SubscriptionAnalysis {
   transactions: PaystackTransaction[]
   liquidations: Liquidation[]
   transaction_volume: number
   liquidation_volume: number
   balance: number
}