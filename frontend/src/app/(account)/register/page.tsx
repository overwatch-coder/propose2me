/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Form from "@/components/Form";
import { useAppContext } from "@/context/AppContext";
import { loginOrRegisterAccount } from "@/utils";

export const metadata = {
  title: "Register an Account | PTM",
  description: "User Registration Page",
};

const RegisterPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { userData, setUserData, setShowSentEmail, showSentEmail, auth } =
    useAppContext();
  const [error, setError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setEmailMessage("");
    setLoading(true);

    const results = await loginOrRegisterAccount(pathname, userData);

    setLoading(false);

    if (results.success) {
      setError("");
      if (results.verification) {
        setShowSentEmail(true);
        setEmailMessage(
          "Please check your email inbox or spam to verify your email address"
        );
      } else {
        setShowSentEmail(false);
        setEmailMessage("");
        router.push('/request')
      }
      setUserData({
        username: "",
        email: "",
        password: "",
      });
    } else {
      setError(results.message);
      setShowSentEmail(false);
      setEmailMessage("");
      setUserData((prev) => ({ ...prev, password: "" }));
    }
  };

  if(auth?.email){
    return redirect('/request');
  }

  return (
    <main className="shadow-lg p-5 md:max-w-2xl mx-auto flex flex-col space-y-5 border border-secondary-subtle/20">
      <section className="flex flex-col space-y-6">
        <h2 className="font-pacifico uppercase text-3xl text-primary text-center">
          PTM - {pathname === "/login" ? "Login" : "Register"}{" "}
        </h2>

        <div className="flex items-center justify-center w-full border border-secondary-subtle/40 shadow-md">
          {/* Register */}
          <Link
            href={"/register"}
            className={`uppercase cursor-pointer text-center w-full py-3 ${
              pathname === "/register"
                ? "bg-primary text-white font-semibold rounded-s-none rounded-b-none rounded-r-md rounded-l-md rounded"
                : ""
            }`}
          >
            Register
          </Link>

          {/* Login */}
          <Link
            href={"/login"}
            className={`uppercase text-center cursor-pointer w-full py-3 ${
              pathname === "/login"
                ? "bg-primary text-white font-semibold rounded-s-md rounded-b-md rounded-r-none rounded-l-none rounded"
                : ""
            }`}
          >
            Login
          </Link>
        </div>
      </section>

      {!showSentEmail ? (
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-y-3"
        >
          {/* Form Fields */}
          <section className="my-4 flex flex-col space-y-4">
            {error && (
              <small className="p-4 rounded bg-red-300/70 text-red-700 text-sm">
                {error}
              </small>
            )}

            <Form />
          </section>

          {/* Buttons */}
          <section className="flex flex-col mx-auto w-full gap-y-3">
            <button
              disabled={loading}
              className="text-center w-full sm:w-fit bg-primary sm:px-5 py-2 uppercase text-white border-primary hover:border hover:bg-transparent hover:text-primary rounded"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {pathname === "/login" ? (
              <small>
                Don't have an account yet?{" "}
                <Link
                  href={"/register"}
                  className="underline text-primary hover:font-semibold"
                >
                  Register
                </Link>
              </small>
            ) : (
              <small>
                Already have an account?{" "}
                <Link
                  href={"/login"}
                  className="underline text-primary hover:font-semibold"
                >
                  Login
                </Link>
              </small>
            )}
          </section>
        </form>
      ) : (
        <div className="p-4 bg-green-300 text-black rounded flex flex-col space-y-3">
          <h3 className="text-center text-xl">Email Verification Sent</h3>
          <p>{emailMessage}</p>
          <button
            className="w-fit px-5 py-2 bg-primary text-white rounded hover:bg-primary/80"
            onClick={() => setShowSentEmail(false)}
          >
            Go Home
          </button>
        </div>
      )}
    </main>
  );
};

export default RegisterPage;
