"use client";

import { useAppContext } from "@/context/AppContext";
import { verifyAccount } from "@/lib/user";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const { auth } = useAppContext();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("verification") || !searchParams.has("email")) {
      return redirect("/");
    }

    const verifyEmail = async () => {
      const verification = searchParams.get("verification") as string;
      const email = searchParams.get("email") as string;

      const results = await verifyAccount(verification, email);

      if (results.success) {
        setEmailVerified(true);
      } else {
        setEmailVerified(false);
        toast.error(results.message);
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (auth?.email) {
    return redirect("/request");
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Verifying Email... | PTM</title>
        <meta name="description" content="Verify your PTM account" />
      </Helmet>

      {emailVerified && (
        <section
          className={`p-10 text-center mx-auto flex-col mt-16 items-center bg-green-200 rounded text-black space-y-5 max-w-lg`}
        >
          <h3 className="text-xl font-semibold">
            Account Verification Successful
          </h3>
          <p>You can now log in and create your awesome proposal</p>

          <Link
            href="/login"
            className="w-fit px-5 py-2 bg-primary-main text-white rounded hover:bg-primary-main/80 block"
          >
            Login
          </Link>
        </section>
      )}

      {!emailVerified && (
        <section
          className={`p-10 text-center mx-auto flex-col mt-16 items-center bg-green-200 rounded text-black space-y-5 max-w-lg`}
        >
          <h3 className="text-xl font-semibold">Account Not Verified</h3>
          <p>Please wait while we verify your account</p>
          <p>Verifying account...</p>
        </section>
      )}
    </>
  );
};

export default VerifyEmail;
