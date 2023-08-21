import Link from 'next/link'

export const metadata = {
    title: '404 | Page Not Found - JFSRC',
    description: 'Page Not Found',
}

const NotFound = () => {
  return (
    <section className='flex flex-col items-center mt-10 space-y-5'>
        <h1 className='font-bold font-[georgia] text-6xl text-primary'>404</h1>
        <h2 className='text-2xl font-semibold'>Page not found</h2>
        <p className='text-gray-600'>
            We are sorry, the page you requested could not be found.
        </p>
        <Link href={'/'} className='px-5 py-3 text-white uppercase bg-primary hover:bg-transparent border hover:border-primary hover:text-primary'>Go Home</Link>
    </section>
  )
}

export default NotFound