import Header from '@components/Header'
import HTMLHead from '@components/HTMLHead'
import Sidebar from '@components/Sidebar'
import { defaultOptions } from '@configs/reactQueryConfigs'
import "@styles/chart.css"
import '@styles/globals.scss'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { useState } from 'react'


export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
   const [queryClient] = useState(() => new QueryClient({
      queryCache: new QueryCache({
         onError: (error: any) => console.error(error),
      }),
      defaultOptions
   }))

   return (
      <QueryClientProvider client={queryClient}>

         <HTMLHead />
         <main className="flex flex-col h-screen">
            <Header />
            <div className="_wrapper flex flex-1 overflow-hidden">
               <Sidebar />
               <div className="_container w-full min-h-full overflow-y-auto scrollbar">
                  <Component {...pageProps} />
               </div>
            </div>
         </main>
      </QueryClientProvider>
   )
}