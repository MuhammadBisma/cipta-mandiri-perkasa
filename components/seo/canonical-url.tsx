import Head from "next/head"

interface CanonicalUrlProps {
  path: string
  domain?: string
}

export default function CanonicalUrl({ path, domain = "https://kubahcmp.id" }: CanonicalUrlProps) {
  const canonicalUrl = `${domain}${path}`

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}
