'use client';

import Link from "next/link";
 
export default function GlobalError({ error, reset }: {
  error: Error,
  reset: () => void
}) {
  return (
    <html>
      <head>
        <title>Oops! Something went wrong!</title>
      </head>
      <body>
        <div className='flex flex-col items-center mx-auto mt-10 space-y-6 text-center'>
          <h2 className='text-4xl font-bold'>Something went wrong!</h2>
          
          <div className="flex flex-col items-center space-y-3 md:flex-row md:space-y-0 md:space-x-5">
            <button
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
              className="px-5 py-3 text-white rounded bg-primary hover:bg-transparent border hover:border-primary hover:text-primary"
            >
              Try again
            </button>

            <Link href={'/'}
              className="px-5 py-3 text-white rounded bg-primary hover:bg-transparent border hover:border-primary hover:text-primary"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}