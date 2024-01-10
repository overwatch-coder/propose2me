"use client";

import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { updateRequest, uploadRequestVideoFile } from "@/lib/request";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { IRequestData } from "../../../../../../types";
import { initialRequestData } from "@/constants";
import RequestForms from "@/app/request/RequestForms";
import Swal from "sweetalert2";

export type FileType = {
  sender: string;
  recipient: string;
  music: string;
  video: string;
};

export type VideoFile = {
  size: number;
  file: File | string;
};

type RequestEditFormProps = {
  userRequestData: IRequestData;
};

const RequestEditForm = ({ userRequestData }: RequestEditFormProps) => {
  // useRef
  const senderPhotoRef = useRef<any>();
  const recipientPhotoRef = useRef<any>();
  const acceptanceMusicRef = useRef<any>();
  const videoRef = useRef<any>();
  const router = useRouter();

  const { auth } = useAppContext();

  // useState
  const [error, setError] = useState("");
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState<VideoFile>({
    size: 0,
    file: "",
  });

  const [fileError, setFileError] = useState<FileType>({
    sender: "",
    recipient: "",
    music: "",
    video: "",
  });

  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState(userRequestData);

  // redirect to login page if user is not logged in
  if (!auth?.email) {
    router.push("/login");
  }

  // set request data to its corresponding values when an input element changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };

  // function to upload files
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const { name } = e.target;
      const file = e.target.files[0];

      // check file type of audio
      if (name === "acceptanceMusic" && file?.type?.split("/")[0] !== "audio") {
        acceptanceMusicRef.current.value = "";
        setFileError((prev) => ({
          ...prev,
          music: "Only audio file types are accepted!",
        }));
        return;
      }

      // check file type of photo
      if (
        (name === "senderPhoto" || name === "recipientPhoto") &&
        file?.type?.split("/")[0] !== "image"
      ) {
        name === "recipientPhoto"
          ? (recipientPhotoRef.current.value = "")
          : (senderPhotoRef.current.value = "");

        setFileError((prev) => ({
          ...prev,
          sender:
            name === "senderPhoto"
              ? "Only image file types are accepted!"
              : prev.sender,
          recipient:
            name === "recipientPhoto"
              ? "Only image file types are accepted!"
              : prev.recipient,
        }));
        return;
      }

      // check for video file types
      if (name === "video" && file?.type?.split("/")[0] !== "video") {
        videoRef.current.value = "";
        setFileError((prev) => ({
          ...prev,
          video: "Only video file types are accepted!",
        }));
        return;
      }

      // check video file size
      const max_video_size = 51200; // in KB (= 50 MB)
      const uploaded_video_size = file.size / 1024; // in KB
      setVideoFile((prev) => ({
        ...prev,
        size: parseFloat((uploaded_video_size / 1024).toFixed(1)),
      })); // file size in MB;

      if (name === "video" && uploaded_video_size > max_video_size) {
        videoRef.current.value = "";
        setFileError((prev) => ({
          ...prev,
          video: "Video file size is greater than the maximum limit (50MB)",
        }));
        return;
      }

      if (name === "video") {
        setVideoFile((prev) => ({ ...prev, file: file }));
        setFileError((prev) => ({ ...prev, video: "" }));
        setVideoUploaded(true);
        const results = await uploadRequestVideoFile(file);

        if (!results?.success) {
          videoRef.current.value = "";
          setVideoFile({ size: 0, file: "" });
          setVideoUploaded(false);
          setFileError((prev) => ({
            ...prev,
            video: "An unexpected error has occurred. Please try again later",
          }));
          return;
        }

        setVideoUploaded(false);
        setRequestData((prev) => ({ ...prev, video: results.secure_url }));
      }

      setFileError({ music: "", recipient: "", sender: "", video: "" });
      if (name !== "video") {
        setRequestData((prev) => ({ ...prev, [name]: file }));
      }
      setVideoUploaded(false);
    }
  };

  // submit request and obtain composed message link
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setVideoUploaded(false);

    // change request data to a form data type
    const formData = new FormData();
    Object.entries(requestData).forEach(([key, value]: [string, any]) => {
      if (key === "senderEmail") {
        formData.append(key, value ? value : auth?.email);
      }

      if (key !== "senderEmail") {
        formData.append(key, value);
      }
    });

    setLoading(true);

    // send request to the server and receive the results
    const results = await updateRequest(
      formData,
      auth?.token!,
      requestData._id!
    );

    // handle this when the request is successful
    if (!results.success) {
      setError(results.message);
      toast.error(results.message);
      setLoading(false);
      Swal.fire({
        title: "Oops. Something went wrong",
        text: results?.message,
        icon: "error",
      });
      return;
    }

    setError("");
    setLoading(false);
    toast.success(results.message);
    Swal.fire({
      title: "Updated!",
      text: results?.message,
      icon: "success",
    });
    setRequestData(initialRequestData);
    router.push("/dashboard/requests");
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{"Update Already Existing Request | PTM"}</title>
        <meta
          name="description"
          content="Design your perfect proposal request"
        />
      </Helmet>

      <main className="shadow-lg p-5 md:max-w-2xl mx-auto flex flex-col space-y-5 border border-secondary-subtle/20 dark:border-white/50">
        <section className="flex flex-col space-y-6 my-7">
          <h2 className="font-pacifico uppercase text-3xl text-primary-main text-center">
            {"PTM - Update Request"}
          </h2>
        </section>

        <form
          onSubmit={handleSubmit}
          method="POST"
          className="flex flex-col gap-y-3"
          encType="multipart/form-data"
        >
          {/* Form Fields */}
          <section className="my-4 flex flex-col space-y-6 dark:text-white">
            {error && (
              <small className="p-4 rounded bg-red-200/80 dark:bg-white dark:border-red-600 dark:border text-red-700 text-sm">
                {error}
              </small>
            )}

            <RequestForms
              handleChange={handleChange}
              uploadFile={uploadFile}
              requestData={requestData}
              setRequestData={setRequestData}
              fileError={fileError}
              setFileError={setFileError}
              senderPhotoRef={senderPhotoRef}
              recipientPhotoRef={recipientPhotoRef}
              acceptanceMusicRef={acceptanceMusicRef}
              videoRef={videoRef}
              videoFile={videoFile}
              setVideoFile={setVideoFile}
              videoUploaded={videoUploaded}
              setVideoUploaded={setVideoUploaded}
            />
          </section>

          {/* Buttons */}
          <section className="flex flex-col mx-auto w-full gap-y-3">
            <button
              disabled={loading}
              className={`text-center w-full sm:w-fit bg-primary-main sm:px-5 py-2 uppercase text-white border-primary-main  rounded ${
                loading
                  ? ""
                  : "hover:border hover:bg-transparent hover:text-primary-main"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-x-1">
                  <span>Updating...</span>
                  <ClipLoader color="#fff" size={20} loading={loading} />
                </div>
              ) : (
                "Update"
              )}
            </button>
          </section>
        </form>
      </main>
    </>
  );
};

export default RequestEditForm;
