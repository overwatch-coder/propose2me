"use client";

import { getRecipientMessage } from "@/utils";
import { redirect, useSearchParams } from "next/navigation";
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
  const [messagesFound, setMessagesFound] = useState(false);

  useEffect(() => {
    if (!searchParams.has("p") || !searchParams.has("u")) {
      return
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
        return
      }
    };

    retrieveMessage();
  }, [searchParams]);

  return (
    <div>
      {!messagesFound ? (
        <section
          className={`p-10 text-center mx-auto flex-col mt-16 items-center bg-green-200 rounded text-black space-y-5 max-w-lg`}
        >
          <h3 className="text-xl font-semibold">No message found</h3>
          <p>Sorry, no message is currently available for you.</p>
          <Link href="/" className="underline text-black text-lg block"
            >
              Go Home
            </Link>
        </section>
      ) :
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
            <div className="mx-auto max-w-full text-center flex flex-col min-h-screen w-full items-center">
              <div className="absolute max-w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen -z-20">
                {/* Overlay Image One */}
                {requestMessage.senderPhoto && (
                  <div className="absolute top-20 left-20 border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] border-white rotate-[-30deg] w-[300px] -z-[100] ">
                    <Image
                      src={requestMessage?.senderPhoto}
                      alt={requestMessage.senderName}
                      width={700}
                      height={700}
                      quality={100}
                      loading="lazy"
                      className="flex-shrink-0 w-full object-cover bg-white"
                    />
                  </div>
                )}

                {/* Overlay Image Two */}
                {requestMessage.recipientPhoto && (
                  <div className="absolute bottom-32 right-12 border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] border-white rotate-[25deg] w-[300px] -z-[100]">
                    <Image
                      src={requestMessage?.recipientPhoto}
                      alt={requestMessage.recipientName}
                      width={700}
                      height={700}
                      quality={100}
                      loading="lazy"
                      className="flex-shrink-0 w-full object-cover bg-white"
                    />
                  </div>
                )}
              </div>

              <form
                className="flex flex-col space-y-5 mx-auto text-center items-center w-full h-full relative bg-gray-300 mix-blend-screen"
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

                <section className="text-lg max-w-4xl w-full mx-auto">
                  <span className="animate-ping">💞💖</span>
                  <Editor
                    init={{
                      toolbar: false,
                      menubar: false,
                    }}
                    disabled={true}
                    value={requestMessage.message}
                  />
                  {/* <div
                    dangerouslySetInnerHTML={{
                      __html: requestMessage?.message as string,
                    }}
                    className="mx-auto text-center"
                  /> */}
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
      </>
    }
    </div>
  );
};

export default RecipientPage;
