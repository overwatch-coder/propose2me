"use client";

import { useAppContext } from "@/context/AppContext";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import RequestForms from "./RequestForms";
import { IRequestData } from "../../../types";
import { initialRequestData } from "@/constants";
import { createRequest, getSavedUrls, saveUrlToDB } from "@/utils";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";

const RequestPage = () => {
  const { auth, setUrls } = useAppContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState({
    status: false,
    url: "",
    copied: false,
  });
  const [requestData, setRequestData] =
    useState<IRequestData>(initialRequestData);

  if (!auth?.email) {
    return redirect("/login");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { name } = e.target;
      const file = e.target.files[0];
      setRequestData((prev) => ({ ...prev, [name]: file }));
    }
  };

  // copy url to clipboard
  const copyToClipboard = (value: string) => {
    copy(value, {
      message: "Link copied",
      format: "text/plain",
      onCopy(clipboardData) {
        setSuccess((prev) => ({ ...prev, copied: true }));
      },
    });

    setTimeout(() => {
      setSuccess((prev) => ({ ...prev, copied: false }));
    }, 2000);
  };

  // submit request and obtain composed message link
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess({ status: false, url: "", copied: false });

    const formData = new FormData();
    Object.entries(requestData).forEach(([key, value]: [string, any]) => {
      formData.append(key, value);
    });

    setLoading(true);

    const results = await createRequest(formData, auth.token);

    if (results.success) {
      setSuccess({ status: true, url: results.url, copied: false });
      toast.success(results.message);
      setError("");

      // save the url to the db
      const saveNewUrl = await saveUrlToDB(
        { url: results.url, postId: results.postId },
        auth.token
      );

      if (saveNewUrl.success) {
        // retrieve all urls from the database
        const savedUrls = await getSavedUrls(auth.token);
        if (savedUrls?.success) {
          setUrls(savedUrls?.data);
        }
      }

      setRequestData(initialRequestData);
    } else {
      setSuccess({ status: false, url: "", copied: false });
      setError(results.message);
      toast.error(results.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Design Your Request | PTM</title>
        <meta
          name="description"
          content="Design your perfect proposal request"
        />
      </Helmet>
      <main className="shadow-lg p-5 md:max-w-2xl mx-auto flex flex-col space-y-5 border border-secondary-subtle/20">
        <section className="flex flex-col space-y-6 my-7">
          <h2 className="font-pacifico uppercase text-3xl text-primary text-center">
            PTM - Request
          </h2>
        </section>

        {success?.status ? (
          <div className="text-center p-10 bg-green-200 text-green-700 flex flex-col space-y-3 rounded">
            <h3 className="text-xl animate-bounce">
              Link Generated Successfully. Good Luck!
            </h3>
            <small>Copy the link below and send it to the recipient</small>
            <p className="cursor-pointer">
              Link:{" "}
              {!success.copied ? (
                <span
                  className="hover:underline"
                  onClick={() => copyToClipboard(success.url)}
                >
                  {success.url}
                </span>
              ) : (
                <span>Copied</span>
              )}
            </p>
            <button
              onClick={() =>
                setSuccess((prev) => ({
                  ...prev,
                  status: false,
                  copied: false,
                }))
              }
              className="underline text-black text-lg pt-5"
            >
              Back to Request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="flex flex-col gap-y-3"
            encType="multipart/form-data"
          >
            {/* Form Fields */}
            <section className="my-4 flex flex-col space-y-4">
              {error && (
                <small className="p-4 rounded bg-red-300/70 text-red-700 text-sm">
                  {error}
                </small>
              )}

              <RequestForms
                handleChange={handleChange}
                uploadFile={uploadFile}
                requestData={requestData}
                setRequestData={setRequestData}
              />
            </section>

            {/* Buttons */}
            <section className="flex flex-col mx-auto w-full gap-y-3">
              <button
                disabled={loading}
                className="text-center w-full sm:w-fit bg-primary sm:px-5 py-2 uppercase text-white border-primary hover:border hover:bg-transparent hover:text-primary rounded"
              >
                {loading ? "Generating..." : "Generate Link"}
              </button>
            </section>
          </form>
        )}
      </main>
    </>
  );
};

export default RequestPage;
