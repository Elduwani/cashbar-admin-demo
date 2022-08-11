interface AllAggregates {
   expenseVolume: number
   investmentVolume: number
   liquidationVolume: number
   transactionCount: number
   customerCount: number
}

interface SubscriptionAnalysis {
   transactions?: Transaction[]
   liquidations?: Transaction[]
   transaction_count: number
   liquidation_count: number
   merged_data: Transaction[]
   transaction_volume: number
   liquidation_volume: number
   percentage_liquidated: number
   balance: number
}

interface PlanDetails {
   subscriptions: Subscription[]
   total_liquidation: number
   liquidations: Liquidation[]
   //num_of_payments
   //num_of_liquidations
   //no need to fetch liquidations, just subscriptions
}