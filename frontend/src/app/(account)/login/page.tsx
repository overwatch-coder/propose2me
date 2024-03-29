"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Form from "@/components/Form";
import { useAppContext } from "@/context/AppContext";
import { loginOrRegisterAccount } from "@/lib/user";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { ClipLoader } from "react-spinners";
import { initialUserAccountData } from "@/constants";

const LoginPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    userAccountData,
    setShowSentEmail,
    setAuth,
    showSentEmail,
    setUserAccountData,
    auth,
  } = useAppContext();
  const [error, setError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    setRedirectUrl(() => (redirect ? redirect : "/request"));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailMessage("");
    setError("");
    setLoading(true);

    const results = await loginOrRegisterAccount(pathname, userAccountData);

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
        const authValue = {
          token: results.token,
          ...results.user,
        };
        localStorage.setItem("auth", JSON.stringify({ ...authValue }));
        setAuth({ ...authValue });
        toast.success(results.message);

        setUserAccountData(initialUserAccountData);

        router.push(redirectUrl);
      }
    } else {
      setEmailMessage("");
      setError(results.message);
      setShowSentEmail(false);
      setUserAccountData((prev) => ({ ...prev, password: "" }));
    }
  };

  if (auth?.email) {
    router.push(redirectUrl);
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Log into your account | PTM</title>
        <meta name="description" content="User Login Page" />
      </Helmet>

      <main className="shadow-lg p-5 md:max-w-lg mx-auto flex flex-col space-y-5 border border-secondary-subtle/20 dark:border-white/50">
        <section className="flex flex-col space-y-6">
          <h2 className="font-pacifico uppercase text-3xl text-primary-main text-center">
            PTM - {pathname === "/login" ? "Login" : "Register"}{" "}
          </h2>

          <div className="flex items-center justify-center w-full border border-secondary-subtle/40 dark:border-white/70 shadow-md">
            {/* Register */}
            <Link
              href={"/register"}
              className={`uppercase cursor-pointer text-center w-full py-3 ${
                pathname === "/register"
                  ? "bg-primary-main text-white font-semibold rounded-s-none rounded-b-none rounded-r-md rounded-l-md rounded"
                  : "dark:text-white"
              }`}
            >
              Register
            </Link>

            {/* Login */}
            <Link
              href={"/login"}
              className={`uppercase text-center cursor-pointer w-full py-3 ${
                pathname === "/login"
                  ? "bg-primary-main text-white font-semibold rounded-s-md rounded-b-md rounded-r-none rounded-l-none rounded"
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
                <small className="p-4 rounded bg-red-300/70 dark:bg-white dark:border-red-600 dark:border text-red-700 text-sm">
                  {error}
                </small>
              )}

              <Form />
            </section>

            {pathname === "/login" && (
              <small className="dark:text-white">
              Forgot password?{" "}
              <Link
                href={"/forgot-password"}
                className="hover:underline text-primary-main hover:font-semibold"
              >
                Click here
              </Link>
            </small>
            )}

            {/* Buttons */}
            <section className="flex flex-col mx-auto w-full gap-y-3">
              <button
                disabled={loading}
                className={`text-center w-full bg-primary-main py-3 uppercase text-white border-primary-main  rounded ${
                  loading
                    ? ""
                    : "hover:border hover:bg-transparent hover:text-primary-main"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-x-1">
                    <span>Please wait</span>
                    <ClipLoader color="#fff" size={20} loading={loading} />
                  </div>
                ) : (
                  "Login"
                )}
              </button>

              {pathname === "/login" ? (
                <>
                  <small className="dark:text-white">
                    Don't have an account yet?{" "}
                    <Link
                      href={"/register"}
                      className="underline text-primary-main hover:font-semibold"
                    >
                      Register
                    </Link>
                  </small>

                  <div className="pt-5 flex flex-col space-y-3">
                    <h3 className="font-semibold text-primary-main">
                      Guest User Details
                    </h3>
                    <small className="dark:text-white/80">
                      Email: botmer@javdeno.site
                    </small>
                    <small className="dark:text-white/80">
                      Password: GuestUser2023@@
                    </small>
                  </div>
                </>
              ) : (
                <small>
                  Already have an account?{" "}
                  <Link
                    href={"/login"}
                    className="underline text-primary-main hover:font-semibold"
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
              className="w-fit px-5 py-2 bg-primary-main text-white rounded hover:bg-primary-main/80"
              onClick={() => setShowSentEmail(false)}
            >
              Go Home
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default LoginPage;
