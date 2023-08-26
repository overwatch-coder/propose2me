"use client";

import { getRecipientMessage } from "@/utils";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { IRequestMessage, IRequestMessageData } from "../../../types";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import Link from "next/link";

const RecipientPage = () => {
  const [requestMessage, setRequestMessage] =
    useState<IRequestMessageData | null>(null);
  const searchParams = useSearchParams();
  const [messagesFound, setMessagesFound] = useState(true);

  useEffect(() => {
    if (!searchParams.has("p") || !searchParams.has("u")) {
      setMessagesFound(false);
      return;
    }

    const retrieveMessage = async () => {
      const postId = searchParams.get("p");
      const userId = searchParams.get("u");

      const results: IRequestMessage = await getRecipientMessage({
        p: postId,
        u: userId,
      });
      if (results?.success) {
        setMessagesFound(true);
        setRequestMessage(results?.data as IRequestMessageData);
      } else {
        toast.info(results?.message);
        setMessagesFound(false);
        return;
      }
    };

    retrieveMessage();
  }, [searchParams]);

  const handleResponse = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.currentTarget.name === "accepted") {
      console.log("Yayyy, accepted");
    } else {
      console.log("Sorry, rejection");
    }
  };

  return (
    <div>
      {!messagesFound ? (
        <section
          className={`p-10 text-center mx-auto flex-col mt-16 items-center bg-green-200 rounded text-black space-y-5 max-w-lg`}
        >
          <h3 className="text-xl font-semibold">No message found</h3>
          <p>Sorry, no message is currently available for you.</p>
          <Link href="/" className="underline text-black text-lg block">
            Go Home
          </Link>
        </section>
      ) : (
        <>
          {!requestMessage?.title ? (
            <section
              className={`p-10 text-center mx-auto flex-col mt-16 items-center bg-green-200 rounded text-black space-y-5 max-w-lg`}
            >
              <h3 className="text-xl font-semibold">Retrieving message</h3>
              <p>Please wait while we retrieive your message</p>
              <p>Retrieving...</p>
            </section>
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

              <section className="relative">
                {/* Overlaying div */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

                {/* Images */}
                {requestMessage.senderPhoto && (
                  <div className="absolute -top-10 left-0 border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] border-white -rotate-[25deg] w-[180px] md:w-[250px] -z-[20]">
                    <Image
                      src={requestMessage?.senderPhoto}
                      alt={requestMessage.senderName}
                      width={700}
                      height={700}
                      quality={100}
                      loading="lazy"
                      className="flex-shrink-0 w-full object-contain"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
                  </div>
                )}

                {requestMessage.recipientPhoto && (
                  <div className="absolute -top-10 right-0 border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] border-white rotate-[25deg] w-[180px] md:w-[250px] -z-[20]">
                    <Image
                      src={requestMessage?.recipientPhoto}
                      alt={requestMessage.recipientName}
                      width={700}
                      height={700}
                      quality={100}
                      loading="lazy"
                      className="flex-shrink-0 w-full object-contain"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
                  </div>
                )}

                {/* Form content */}
                <form
                  className="flex flex-col space-y-7 mx-auto text-center items-center w-full  h-full relative bg-gray-400 mix-blend-screen py-10 px-2 md:px-8"
                  method="POST"
                >
                  <h2 className="text-base md:text-xl font-bold uppercase mb-2 font-pacifico text-primary animate-pulse">
                    A message from <span>{requestMessage?.senderName}</span> to{" "}
                    <span>{requestMessage?.recipientName}</span>
                  </h2>

                  <h1 className="text-black font-pacifico text-2xl md:text-4xl font-bold tracking-wider leading-relaxed text-center">
                    <span className="animate-pulse">💕</span>
                    {requestMessage?.title}{" "}
                    <span className="animate-pulse">💕</span>
                  </h1>

                  <section className="text-lg max-w-4xl w-full mx-auto">
                    <span className="animate-ping absolute top-20 right-1/3 rotate-90">
                      💞💖
                    </span>
                    <div className="">
                      <Editor
                        init={{
                          toolbar: false,
                          menubar: false,
                          height: 600,
                        }}
                        disabled={true}
                        value={requestMessage.message}
                      />
                    </div>
                    {/* <div
                      className="hidden bg-white py-5 px-3 shadow-md rounded-md"
                      dangerouslySetInnerHTML={{
                        __html: requestMessage.message as TrustedHTML,
                      }}
                    /> */}
                    <span className="animate-ping absolute bottom-1/2 left-1/3 rotate-45">
                      💞💖
                    </span>
                  </section>

                  <div className="flex flex-col gap-y-5 md:flex-row md:gap-y-0 md:gap-x-5 md:items-center">
                    <button
                      className="text-lg py-3 px-5 rounded bg-primary text-white uppercase border hover:border-primary hover:bg-transparent hover:text-primary"
                      type="submit"
                      name="accepted"
                      onClick={handleResponse}
                    >
                      Yes, I accept ❤️
                    </button>

                    <button
                      className="text-lg py-3 px-5 rounded bg-primary text-white uppercase border hover:border-primary hover:bg-transparent hover:text-primary"
                      type="submit"
                      name="rejected"
                      onClick={handleResponse}
                    >
                      Sorry, not Interested 💔
                    </button>
                  </div>
                </form>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RecipientPage;
