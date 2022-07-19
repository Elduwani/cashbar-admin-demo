import Header from '@components/Header'
import HTMLHead from '@components/HTMLHead'
import Sidebar from '@components/Sidebar'
import "@styles/chart.css"
import '@styles/globals.scss'
import type { AppProps } from 'next/app'


export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <>
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
    </>
  )
}