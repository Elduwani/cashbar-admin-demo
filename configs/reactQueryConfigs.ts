
export const defaultOptions = {
    queries: {
        useErrorBoundary: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 1000 * 30 //30secs,
    }
}

export const queryKeys = {
    investments: 'investments',
    liquidations: 'liquidations',
    customers: 'customers',
    expenses: 'expenses',
}
