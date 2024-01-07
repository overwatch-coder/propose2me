"use client"; // Error components must be Client Components

import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      <Head>
        <title>Oops! Something went wrong!</title>
      </Head>

      <div className="flex flex-col items-center mx-auto mt-10 space-y-6 text-center">
        <h2 className="text-4xl font-bold">Something went wrong!</h2>

        <div className="flex flex-col items-center space-y-3 md:flex-row md:space-y-0 md:space-x-5">
          <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="px-5 py-3 text-white rounded bg-primary-main hover:bg-transparent border hover:border-primary-main hover:text-primary-main"
          >
            Try again
          </button>

          <Link
            href={"/"}
            className="px-5 py-3 text-white rounded bg-primary-main hover:bg-transparent border hover:border-primary-main hover:text-primary-main"
          >
            Go home
          </Link>
        </div>
      </div>
    </>
  );
}
