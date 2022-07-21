import Header from '@components/Header'
import HTMLHead from '@components/HTMLHead'
import Sidebar from '@components/Sidebar'
import { defaultOptions } from '@configs/reactQueryConfigs'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import "@styles/chart.css"
import '@styles/globals.scss'
import { ToastProvider } from '@contexts/Notification.context'

export type NextPageWithLayout = NextPage & {
   getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
   Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {

   const getLayout = Component.getLayout || ((page) => page)

   const [queryClient] = useState(() => new QueryClient({
      queryCache: new QueryCache({
         onError: (error: any) => console.error(error),
      }),
      defaultOptions
   }))

   return (
      <ToastProvider>
         <QueryClientProvider client={queryClient}>
            <HTMLHead />
            <main className="flex flex-col h-screen">
               <Header />
               <div className="_wrapper flex flex-1 overflow-hidden">
                  <Sidebar />
                  <div className="_container w-full min-h-full overflow-y-auto scrollbar">
                     {
                        getLayout(<Component {...pageProps} />)
                     }
                  </div>
               </div>
            </main>
         </QueryClientProvider>
      </ToastProvider>
   )
}