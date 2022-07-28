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

type TransactionFilterParams = 'period' | 'less_than' | 'greater_than' | 'status'