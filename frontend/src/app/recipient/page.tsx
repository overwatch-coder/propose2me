"use client";

import { deleteUrlToDB, getRecipientMessage, sendRequestEmail } from "@/utils";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { IRequestMessage, IRequestMessageData } from "../../../types";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { ClipLoader } from "react-spinners";
import thumbnail from "@/assets/thumbnail.png";
import ReactPlayer from "react-player";
import FireWorks from "./FireWorks";

const RecipientPage = () => {
  const { auth, setUrls } = useAppContext();
  const [requestMessage, setRequestMessage] =
    useState<IRequestMessageData | null>(null);
  const searchParams = useSearchParams();
  const [messagesFound, setMessagesFound] = useState(true);
  const [loading, setLoading] = useState({
    type: "",
    status: false,
  });
  const [requestSent, setRequestSent] = useState(false);
  const [optionalMessage, setOptionalMessage] = useState({
    active: false,
    value: "",
  });
  const [showFireworks, setShowFireworks] = useState(false);

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
    setRequestSent(false);
    setLoading((prev) => ({ ...prev, status: true }));

    const acceptedForFireworks = e.currentTarget.name === "accepted";

    const template_params = {
      from_name: requestMessage?.recipientName,
      to_name: requestMessage?.senderName,
      response: "",
      optional_message: optionalMessage.value
        ? optionalMessage.value
        : `From PTM: ${requestMessage?.recipientName} did not leave any optional message for you.`,
      ptm_response: "",
      to_email: requestMessage?.senderEmail,
    };

    if (e.currentTarget.name === "accepted") {
      setLoading((prev) => ({ ...prev, type: "accepted" }));
      template_params.response = "Yes, I accept your request!";
      template_params.ptm_response = `Hurray! Congratulations ${requestMessage?.senderName}. Best of luck on your new adventure with ${requestMessage?.recipientName}`;
    } else {
      setLoading((prev) => ({ ...prev, type: "rejected" }));
      template_params.response = "Sorry, I am not interested!";
      template_params.ptm_response = `We're sorry you didn't get a positive response from ${requestMessage?.recipientName}. Best of luck!`;
      setShowFireworks(false);
    }

    // get paramters from query
    const postId = searchParams.get("p") as string;
    const userId = searchParams.get("u") as string;

    // send request response through email and delete the request on email sent
    const results = await sendRequestEmail(template_params);

    if (results.success) {
      setLoading((prev) => ({ ...prev, status: false }));
      displayFireworks(acceptedForFireworks);

      const deleteResults = await deleteUrlToDB(postId, userId);

      if (deleteResults.success) {
        toast.success(results.message);
        if (auth?.token) {
          setUrls((prev: any) =>
            prev.filter((url: any) => url.postId !== postId)
          );
        }
      } else if (
        !deleteResults.success &&
        deleteResults.message === "No messages available"
      ) {
        toast.info(deleteResults.message);
        searchParams.delete();
      } else {
        toast.error(deleteResults.message);
      }
    } else {
      setShowFireworks(false);
      toast.error(
        "There was a problem processing your response. Please try again later!"
      );
      setRequestSent(false);
      setLoading((prev) => ({ ...prev, status: false }));
    }
  };

  // handle optional message display
  const handleOptionalMessage = () => {
    setOptionalMessage((prev) => ({
      value: !prev.active ? prev.value : "",
      active: !prev.active,
    }));
  };

  // function to display fireworks for maximum of 10 seconds
  const displayFireworks = (display: boolean) => {
    if (display) {
      setShowFireworks(display);
      setTimeout(() => {
        setShowFireworks(false);
        setRequestSent(true);
      }, 8000);
    } else {
      setShowFireworks(false);
      setRequestSent(true);
    }
  };

  return (
    <>
      {showFireworks && (
        <FireWorks
          showFireworks={showFireworks}
          senderName={requestMessage?.senderName as string}
          recipientName={requestMessage?.recipientName as string}
        />
      )}

      <div className={showFireworks ? "hidden" : "block"}>
        {requestSent ? (
          <>
            <article className="p-10 text-center mx-auto flex-col mt-16 items-center bg-green-200 rounded text-black space-y-5 max-w-lg">
              <h3 className="text-xl font-semibold">
                Response has been successfully submitted!
              </h3>
              <p>
                Your response to the request has been successfully received.
              </p>
              <Link href="/" className="underline text-black text-lg block">
                Go Home
              </Link>
            </article>
          </>
        ) : !messagesFound ? (
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
                      A message from <span>{requestMessage?.senderName}</span>{" "}
                      to <span>{requestMessage?.recipientName}</span>
                    </h2>

                    <h1 className="text-black font-pacifico text-2xl md:text-4xl font-bold tracking-wider leading-relaxed text-center">
                      <span className="animate-pulse">💕</span>
                      {requestMessage?.title}{" "}
                      <span className="animate-pulse">💕</span>
                    </h1>

                    {requestMessage.message && (
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

                        <span className="animate-ping absolute bottom-1/2 left-1/3 rotate-45">
                          💞💖
                        </span>
                      </section>
                    )}

                    {requestMessage.video && (
                      <>
                        <span className="animate-ping absolute top-20 right-1/3 rotate-90">
                          💞💖
                        </span>

                        <h3 className="text-xl font-semibold">
                          {requestMessage.senderName} sent a video. <br />
                          Click on the video to play it.
                        </h3>

                        <ReactPlayer
                          url={requestMessage?.video}
                          width={"100%"}
                          controls={true}
                          light={
                            <Image
                              src={thumbnail}
                              alt="video thumbnail"
                              width={700}
                              height={700}
                              quality={100}
                              loading="lazy"
                            />
                          }
                        />

                        <span className="animate-ping absolute bottom-1/2 left-1/3 rotate-45">
                          💞💖
                        </span>
                      </>
                    )}

                    <div className="flex flex-col space-y-3">
                      <h2>
                        {optionalMessage.active
                          ? "Remove optional note?"
                          : "Attach a personal note to this response?"}
                        <span
                          onClick={handleOptionalMessage}
                          className="ms-2 cursor-pointer hover:underline font-semibold"
                        >
                          Click here
                        </span>
                      </h2>

                      {optionalMessage.active && (
                        <>
                          <label htmlFor="optional_message" className="text-sm">
                            Type your special note to{" "}
                            <b>{requestMessage.senderName}</b> here and it will
                            be delivered along with your answer to the request.
                          </label>

                          <textarea
                            name="optional_message"
                            id="optional_message"
                            value={optionalMessage.value}
                            onChange={(e) =>
                              setOptionalMessage((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-2 w-full px-2"
                            placeholder="I have been waiting for you to ask me for a long time!!"
                            rows={7}
                          />
                        </>
                      )}
                    </div>

                    <div className="flex flex-col gap-y-5 md:flex-row md:gap-y-0 md:gap-x-5 md:items-center">
                      <button
                        className="text-base py-3 px-5 rounded bg-primary text-white uppercase border hover:border-primary hover:bg-transparent hover:text-primary"
                        type="submit"
                        name="accepted"
                        onClick={handleResponse}
                        disabled={loading.type === "accepted" && loading.status}
                      >
                        {loading.type === "accepted" && loading.status ? (
                          <div className="flex items-center justify-center gap-x-1">
                            <span>Sending...</span>
                            <ClipLoader color="#fff" size={20} />
                          </div>
                        ) : (
                          requestMessage.customYesResponse
                        )}
                      </button>

                      <button
                        className="text-base py-3 px-5 rounded bg-primary text-white uppercase border hover:border-primary hover:bg-transparent hover:text-primary"
                        type="submit"
                        name="rejected"
                        onClick={handleResponse}
                        disabled={loading.type === "rejected" && loading.status}
                      >
                        {loading.type === "rejected" && loading.status ? (
                          <div className="flex items-center justify-center gap-x-1">
                            <span>Sending...</span>
                            <ClipLoader color="#fff" size={20} />
                          </div>
                        ) : (
                          requestMessage.customNoResponse
                        )}
                      </button>
                    </div>
                  </form>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RecipientPage;
