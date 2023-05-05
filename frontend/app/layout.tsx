import './globals.css'

export const metadata = {
  title: 'PTM - Home of everlasting happiness',
  description: 'Propose2me Inc. Home of everlasting happiness!!'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" type="image/png" href="favicon.png" />
      <body className='bg-white dark:bg-slate-950'>{children}</body>
    </html>
  )
}
