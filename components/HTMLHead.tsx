import Head from 'next/head'

interface Props {
    title?: string,
    content?: string
}

export default function HTMLHead({ title, content = "Loan Management System" }: Props) {
    let displayTitle = title ? title + " | Lendo Africa" : "Lendo Africa"
    return (
        <Head>
            <title>{displayTitle}</title>
            <meta name="description" content={content} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    )
}