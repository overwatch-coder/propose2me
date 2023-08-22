"use client";

import { getRecipientMessage } from "@/utils";
import { notFound, redirect, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { IRequestMessage, IRequestMessageData } from "../../../types";

const RecipientPage = () => {
  const [requestMessage, setRequestMessage] =
    useState<IRequestMessageData | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("p") || !searchParams.has("u")) {
      return redirect("/");
    }

    const retrieveMessage = async () => {
      const postId = searchParams.get("p");
      const userId = searchParams.get("u");

      const results: IRequestMessage = await getRecipientMessage({
        p: postId,
        u: userId,
      });
      if (results?.success) {
        setRequestMessage(results?.data as IRequestMessageData);
      } else {
        toast.error(results?.message);
        return redirect("/");
      }
    };

    retrieveMessage();
  }, [searchParams]);

  return (
    <div>
      {!requestMessage?.title ? (
        <div>{notFound()}</div>
      ) : (
        <>
          <Helmet>
            <meta charSet="utf-8" />
            <title>{requestMessage?.title}</title>
            <meta
              name="description"
              content="Reply to your proposal and receive notification in an instant"
            />
          </Helmet>
          <section>
            <div className="mx-auto max-w-2xl text-center flex flex-col min-h-screen w-full items-center">
              <form
                className="flex flex-col space-y-5 mx-auto text-center items-center"
                method="POST"
              >
                <h2 className="text-xl font-bold uppercase mb-2 font-pacifico text-primary">
                  A message from <span>{requestMessage?.senderName}</span> to{" "}
                  <span>{requestMessage?.recipientName}</span>
                </h2>

                <h1 className="text-black font-nunito text-4xl font-bold">
                  <span className="animate-pulse">💕</span>
                  {requestMessage?.title}{" "}
                  <span className="animate-pulse">💕</span>
                </h1>

                <section className="text-lg text-center">
                  <span className="animate-ping">💞💖</span>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: requestMessage?.message as string,
                    }}
                  />
                  <span className="animate-ping">💞💖</span>
                </section>

                <div className="flex flex-col gap-y-5 md:flex-row md:gap-y-0 md:gap-x-5 md:items-center">
                  <button
                    className="text-lg py-3 px-5 rounded bg-primary text-white uppercase border hover:border-primary hover:bg-transparent hover:text-primary"
                    type="submit"
                  >
                    Yes, I accept ❤️
                  </button>

                  <button
                    className="text-lg py-3 px-5 rounded bg-primary text-white uppercase border hover:border-primary hover:bg-transparent hover:text-primary"
                    type="submit"
                  >
                    Sorry, not Interested 💔
                  </button>
                </div>

                <span className="animate-ping">💞💖</span>
              </form>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default RecipientPage;
