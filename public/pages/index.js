import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Welcome to My Project</title>
        <meta name="description" content="A Next.js project with MySQL connection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to My Project!</h1>
        <p>This is a simple Next.js project with MySQL database integration.</p>
        <p>You can query users by accessing the /api/register endpoint.</p>
      </main>

      <footer>
        <p>Powered by Next.js & MySQL</p>
      </footer>
    </div>
  )
}
