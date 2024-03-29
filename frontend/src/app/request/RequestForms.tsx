"use client";

import React, { useRef, useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { IRequestData } from "../../../types";
import ReactSwitch from "react-switch";
import ShowPreview from "./ShowPreview";
import { VscClose } from "react-icons/vsc";
import { FileType, VideoFile } from "./page";
import { useAppContext } from "@/context/AppContext";
import ReactPlayer from "react-player";
import Image from "next/image";
import thumbnail from "@/assets/thumbnail.png";

type AudioFileType = {
  status: boolean;
  audio: HTMLAudioElement | null;
};

type RequestFormsProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requestData: IRequestData;
  setRequestData: React.Dispatch<React.SetStateAction<IRequestData>>;
  fileError: FileType;
  setFileError: React.Dispatch<React.SetStateAction<FileType>>;
  senderPhotoRef: React.MutableRefObject<any>;
  recipientPhotoRef: React.MutableRefObject<any>;
  acceptanceMusicRef: React.MutableRefObject<any>;
  videoRef: React.MutableRefObject<any>;
  videoFile: VideoFile;
  setVideoFile: React.Dispatch<React.SetStateAction<VideoFile>>;
  videoUploaded: boolean;
  setVideoUploaded: (value: React.SetStateAction<boolean>) => void;
};

const RequestForms = ({
  handleChange,
  uploadFile,
  requestData,
  setRequestData,
  fileError,
  setFileError,
  senderPhotoRef,
  recipientPhotoRef,
  acceptanceMusicRef,
  videoRef,
  videoFile,
  setVideoFile,
  videoUploaded,
  setVideoUploaded,
}: RequestFormsProps) => {
  // useRef
  const editorRef = useRef<any>(null);
  const videoPlayerRef = useRef<any>();

  // context
  const { auth } = useAppContext();

  // useState
  const [showVideo, setShowVideo] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [audio, setAudio] = useState<AudioFileType>({
    status: false,
    audio: null,
  });

  useEffect(() => {
    setShowVideo(requestData._id && requestData?.video ? true : false);
  }, [requestData?._id, requestData?.video]);

  // set audio
  useEffect(() => {
    if (
      requestData.acceptanceMusic &&
      typeof requestData.acceptanceMusic !== "string"
    ) {
      const audio = new Audio(
        URL.createObjectURL(requestData?.acceptanceMusic)
      );

      setAudio((prev) => ({ ...prev, audio: audio }));
    }
  }, [requestData.acceptanceMusic]);

  const playAudio = () => {
    if (audio.status) {
      audio.audio?.pause();
      setAudio((prev) => ({ ...prev, status: false }));
    } else {
      audio.audio?.play();
      setAudio((prev) => ({ ...prev, status: true }));
    }
  };

  return (
    <>
      {/* Sender and Recipient Name Group */}
      <section className="flex flex-col space-y-5 md:flex-row md:space-y-0 md:justify-between md:items-center md:space-x-5">
        {/* Sender Name */}
        <div className="flex flex-col space-y-2 w-full">
          <label htmlFor="senderName">Sender Name</label>
          <input
            className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
            onChange={handleChange}
            value={requestData.senderName}
            type="text"
            name="senderName"
            placeholder="e.g Joshua"
            required
          />
        </div>

        {/* Recipient Name */}
        <div className="flex flex-col space-y-2 w-full">
          <label htmlFor="recipientName">Recipient Name</label>
          <input
            className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
            onChange={handleChange}
            value={requestData.recipientName}
            type="text"
            name="recipientName"
            placeholder="e.g Jael"
            required
          />
        </div>
      </section>

      {/* Request title */}
      <div className="flex flex-col space-y-3 w-full">
        <label htmlFor="title">Message Title</label>
        <input
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          onChange={handleChange}
          value={requestData.title}
          type="text"
          name="title"
          placeholder="e.g  Will you do me the honors of being my girlfriend?"
          required
        />
      </div>

      {/* Custom Yes and No Response Group */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-sm dark:text-white/70">
          Provide text for the buttons that appear on recipient's request
        </h2>

        <section className="flex flex-col space-y-5 md:flex-row md:space-y-0 md:justify-between md:items-center md:space-x-5">
          {/* Sender Name */}
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="customYesResponse">Accepted Button Text</label>
            <input
              className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
              onChange={handleChange}
              value={requestData.customYesResponse}
              type="text"
              name="customYesResponse"
              placeholder="YES, I ACCEPT ❤️"
            />
            <small className="dark:text-white/70">
              Leave it blank to use default button text
            </small>
          </div>

          {/* Recipient Name */}
          <div className="flex flex-col space-y-2 w-full">
            <label htmlFor="customNoResponse">Not Accepted Button Text</label>
            <input
              className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
              onChange={handleChange}
              value={requestData.customNoResponse}
              type="text"
              name="customNoResponse"
              placeholder="SORRY, NOT INTERESTED 💔"
            />
            <small className="dark:text-white/70">
              Leave it blank to use default button text
            </small>
          </div>
        </section>
      </div>

      {/* Email Address */}
      <div className="flex flex-col space-y-2 w-full">
        <label htmlFor="senderEmail">Sender Email Address</label>
        <small className="dark:text-white/70">
          Leave it blank to use your acccount email
        </small>
        <input
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          onChange={handleChange}
          value={requestData.senderEmail}
          type="email"
          name="senderEmail"
          placeholder={`e.g ${auth?.email}`}
        />
      </div>

      {/* hidden fields if user is updating request */}
      {requestData._id && typeof requestData.recipientPhoto === "string" && (
        <input
          onChange={handleChange}
          value={requestData.recipientPhoto}
          type="text"
          name="recipientPhoto"
          hidden={true}
        />
      )}

      {requestData._id && typeof requestData.senderPhoto === "string" && (
        <input
          onChange={handleChange}
          value={requestData.senderPhoto}
          type="text"
          name="senderPhoto"
          hidden={true}
        />
      )}

      {requestData._id && typeof requestData.acceptanceMusic === "string" && (
        <input
          onChange={handleChange}
          value={requestData.acceptanceMusic}
          type="text"
          name="acceptanceMusic"
          hidden={true}
        />
      )}

      {requestData._id && typeof requestData.video === "string" && (
        <input
          onChange={handleChange}
          value={requestData.video}
          type="text"
          name="video"
          hidden={true}
        />
      )}

      {/* Upload Video Request Instead */}
      <div className="flex items-center space-x-4 pt-4 pb-2">
        <ReactSwitch
          onChange={(e) => {
            setShowVideo(e);

            if (e === true) {
              setRequestData((prev) => ({
                ...prev,
                message:
                  requestData?._id && requestData?.message
                    ? requestData?.message
                    : "",
              }));
            } else {
              setFileError((prev) => ({ ...prev, video: "" }));
              setVideoFile({ size: 0, file: "" });
              setVideoUploaded(false);
            }
          }}
          checked={showVideo}
          className="border border-gray-700"
          offColor="#fff"
          onColor="#808080"
          uncheckedIcon={false}
          checkedIcon={false}
          onHandleColor="#ffffff"
          offHandleColor="#808080"
          activeBoxShadow="undefined"
        />
        <span className="text-secondary-main dark:text-white">
          Upload Video Message Instead?
        </span>
      </div>

      {showVideo && (
        <section className="flex flex-col space-y-2 w-full">
          {requestData?._id &&
            requestData?.video &&
            typeof requestData?.video === "string" && (
              <div className="flex flex-col space-y-2">
                <h1 className="text-sm font-semibold tracking-wider">
                  Existing Video
                </h1>

                <ReactPlayer
                  url={requestData.video}
                  width={"100%"}
                  controls={true}
                  ref={videoPlayerRef}
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
              </div>
            )}

          {/* Form input to upload a video request */}
          <label htmlFor="video">Upload your video (Max: 50MB)</label>
          <div className="relative">
            <input
              className="rounded py-3 w-full px-2 outline-none shadow border border-secondary-main"
              onChange={uploadFile}
              type="file"
              name="video"
              ref={videoRef}
            />

            {/* Display successful upload message */}
            {videoFile.file && !videoUploaded && (
              <span>Video uploaded successfully</span>
            )}

            {/* Displaying uploading status */}
            {videoFile.file && videoUploaded && (
              <span>Uploading. Please wait...</span>
            )}

            {/* display video being uploaded file size */}
            {requestData.video && (
              <div className="flex flex-row justify-between w-full pt-2">
                <span>Size: {videoFile?.size || 0} MB</span>
                <span>Max: 50MB</span>
              </div>
            )}

            {/* remove video file from input field */}
            {requestData.video && (
              <span
                className="absolute top-4 right-2 cursor-pointer"
                onClick={() => {
                  setRequestData((prev) => ({
                    ...prev,
                    video: "",
                  }));
                  videoRef.current.value = "";
                  setFileError((prev) => ({ ...prev, video: "" }));
                  setVideoFile({ size: 0, file: "" });
                  setVideoUploaded(false);
                }}
              >
                <VscClose size={25} className="text-secondary-subtle" />
              </span>
            )}
          </div>
          {fileError.video && (
            <small className="text-red-700 text-sm">{fileError.video}</small>
          )}
        </section>
      )}

      {/* Message Rich Text Editor */}
      {!showVideo && (
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          textareaName="message"
          value={requestData.message}
          onEditorChange={(e) =>
            setRequestData((prev) => ({ ...prev, message: e }))
          }
          init={{
            height: 400,
            menubar: true,
            plugins: [
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "fullscreen",
              "media",
            ],
            toolbar: true,
            content_style:
              'body { font-family: "Nunito", sans-serif; font-size:14px }',
          }}
        />
      )}

      {/* Advanced Options */}
      <section className="flex flex-col space-y-7 mt-10 pt-5">
        {/* Enable Advanced Options Switch */}
        <div className="flex items-center space-x-4">
          <ReactSwitch
            onChange={(e) => setShowAdvanced(e)}
            checked={showAdvanced}
            className="border border-gray-700"
            offColor="#fff"
            onColor="#808080"
            uncheckedIcon={false}
            checkedIcon={false}
            onHandleColor="#ffffff"
            offHandleColor="#808080"
            activeBoxShadow="undefined"
          />
          <span className="text-secondary-main dark:text-white">
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </span>
        </div>

        {/* Advanced File Input Fields */}
        <div
          className={`flex flex-col space-y-4 ${
            showAdvanced ? "flex" : "hidden"
          }`}
        >
          {/* Recipient Photo */}
          <div className="flex flex-col space-y-2 w-full">
            {requestData?._id && requestData?.recipientPhoto && (
              <div className="flex flex-col space-y-2">
                <h2 className="text-sm font-semibold tracking-wider">
                  Existing Recipient Photo
                </h2>

                <Image
                  src={
                    requestData?.recipientPhoto &&
                    typeof requestData.recipientPhoto === "string"
                      ? requestData.recipientPhoto
                      : URL.createObjectURL(requestData?.recipientPhoto)
                  }
                  alt={requestData.recipientName}
                  width={700}
                  height={700}
                  quality={100}
                  loading="lazy"
                  className="flex-shrink-0 w-48 h-48 object-contain"
                />
              </div>
            )}

            <label htmlFor="recipientPhoto">Recipient Photo</label>
            <div className="relative">
              <input
                className="rounded py-3 w-full px-2 outline-none shadow border border-secondary-main"
                onChange={uploadFile}
                type="file"
                name="recipientPhoto"
                ref={recipientPhotoRef}
              />

              {requestData.recipientPhoto && (
                <span
                  className="absolute top-4 right-2 cursor-pointer"
                  onClick={() => {
                    setRequestData((prev) => ({
                      ...prev,
                      recipientPhoto: "",
                    }));
                    recipientPhotoRef.current.value = "";
                    setFileError((prev) => ({ ...prev, recipient: "" }));
                  }}
                >
                  <VscClose size={25} className="text-secondary-subtle" />
                </span>
              )}
            </div>
            {fileError.recipient && (
              <small className="text-red-700 text-sm">
                {fileError.recipient}
              </small>
            )}
          </div>

          {/* Sender Photo */}
          <div className="flex flex-col space-y-2 w-full">
            {requestData?._id && requestData?.senderPhoto && (
              <div className="flex flex-col space-y-2">
                <h2 className="text-sm font-semibold tracking-wider">
                  Existing Sender Photo
                </h2>

                <Image
                  src={
                    requestData?.senderPhoto &&
                    typeof requestData.senderPhoto === "string"
                      ? requestData?.senderPhoto
                      : URL.createObjectURL(requestData?.senderPhoto)
                  }
                  alt={requestData.senderName}
                  width={700}
                  height={700}
                  quality={100}
                  loading="lazy"
                  className="flex-shrink-0 w-48 h-48 object-contain"
                />
              </div>
            )}

            <label htmlFor="senderPhoto">Sender Photo</label>
            <div className="relative">
              <input
                className="rounded py-3 w-full px-2 outline-none shadow border border-secondary-main"
                onChange={uploadFile}
                type="file"
                name="senderPhoto"
                ref={senderPhotoRef}
              />
              {requestData.senderPhoto && (
                <span
                  className="absolute top-4 right-2 cursor-pointer"
                  onClick={() => {
                    setRequestData((prev) => ({
                      ...prev,
                      senderPhoto: "",
                    }));
                    senderPhotoRef.current.value = "";
                    setFileError((prev) => ({ ...prev, sender: "" }));
                  }}
                >
                  <VscClose size={25} className="text-secondary-subtle" />
                </span>
              )}
            </div>
            {fileError.sender && (
              <small className="text-red-700 text-sm">{fileError.sender}</small>
            )}
          </div>

          {/* Acceptance Music */}
          {/* <div className="flex-col space-y-2 w-full hidden">
            <label htmlFor="acceptanceMusic">Acceptance Music</label>
            <div className="relative">
              <input
                className="rounded py-3 w-full px-2 outline-none shadow border border-secondary-main"
                onChange={uploadFile}
                type="file"
                name="acceptanceMusic"
                ref={acceptanceMusicRef}
              />

              {requestData.acceptanceMusic && (
                <>
                  <span
                    className="absolute top-4 right-2 cursor-pointer"
                    onClick={() => {
                      setRequestData((prev) => ({
                        ...prev,
                        acceptanceMusic: "",
                      }));
                      acceptanceMusicRef.current.value = "";
                      setFileError((prev) => ({ ...prev, music: "" }));
                      audio.audio?.pause();
                      setAudio({ audio: null, status: false });
                    }}
                  >
                    <VscClose size={25} className="text-secondary-subtle" />
                  </span>
                </>
              )}
            </div>
          </div>
          {fileError.music && (
            <small className="text-red-700 text-sm hidden">
              {fileError.music}
            </small>
          )} */}
        </div>

        {/* Show Preview */}
        <div
          className={`flex items-center justify-between space-x-4 ${
            showPreview &&
            (requestData.senderPhoto || requestData.recipientPhoto)
              ? "pb-20"
              : "pb-0"
          }`}
        >
          <div className="flex items-center space-x-4">
            <ReactSwitch
              onChange={(e) => setShowPreview(e)}
              checked={showPreview}
              className="border border-gray-700"
              offColor="#fff"
              onColor="#808080"
              uncheckedIcon={false}
              checkedIcon={false}
              onHandleColor="#ffffff"
              offHandleColor="#808080"
              activeBoxShadow="undefined"
            />
            <span className="text-secondary-main ms-auto dark:text-white">
              {showPreview ? "Hide" : "Show"} Live Preview
            </span>
          </div>

          {/* Test Audio file */}
          {/* {showPreview && requestData.acceptanceMusic && (
            <span
              onClick={playAudio}
              className="cursor-pointer hover:text-primary-main w-fit hidden"
            >
              {audio.status ? "Pause" : "Test Audio"}
            </span>
          )} */}
        </div>

        <div>
          {showPreview && (
            <ShowPreview
              requestData={requestData}
              showVideo={showVideo}
              videoFile={videoFile}
              videoPlayerRef={videoPlayerRef}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default RequestForms;
