interface AllAggregates {
   expenseVolume: number
   investmentVolume: number
   liquidationVolume: number
   transactionCount: number
   customerCount: number
}

interface SubscriptionAnalysis {
   transactions: Transaction[]
   liquidations: Transaction[]
   merged_data: Transaction[]
   transaction_volume: number
   liquidation_volume: number
   balance: number
}