
export const defaultOptions = {
   queries: {
      useErrorBoundary: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 1000 * 60 //60secs TODO: reduce this in production,
   }
}

export const queryKeys = {
   investments: 'investments',
   liquidations: 'liquidations',
   customers: 'customers',
   expenses: 'expenses',
   subscriptions: 'subscriptions',
   transactions: 'transactions',
   aggregates: 'aggregates',
}
