import Head from 'next/head'

interface Props {
   title?: string,
   content?: string
}

export default function HTMLHead({ title = 'Cashbar', content = "Savings made simple" }: Props) {
   return (
      <Head>
         <title>{title}</title>
         <meta name="description" content={content} />
         <link rel="icon" href="/favicon.ico" />
      </Head>
   )
}