"use client";

import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { IRequestData } from "../../../types";
import ReactSwitch from "react-switch";

type RequestFormsProps = {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  requestData: IRequestData;
  setRequestData: React.Dispatch<React.SetStateAction<IRequestData>>;
};

const RequestForms = ({
  handleChange,
  uploadFile,
  requestData,
  setRequestData,
}: RequestFormsProps) => {
  const editorRef = useRef<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      {/* Sender and Recipient Name Group */}
      <section className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between md:items-center md:space-x-5">
        {/* Sender Name */}
        <div className="flex flex-col space-y-2 w-full">
          <label htmlFor="senderName">Sender Name</label>
          <input
            className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
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
            className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
            onChange={handleChange}
            value={requestData.recipientName}
            type="text"
            name="recipientName"
            placeholder="e.g Jaiel"
            required
          />
        </div>
      </section>

      {/* Request title */}
      <div className="flex flex-col space-y-2 w-full">
        <label htmlFor="title">Message Title</label>
        <input
          className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          onChange={handleChange}
          value={requestData.title}
          type="text"
          name="title"
          placeholder="e.g  Will you be my girlfriend?"
          required
        />
      </div>

      {/* Email Address */}
      <div className="flex flex-col space-y-2 w-full">
        <label htmlFor="senderEmail">Sender Email Address</label>
        <input
          className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          onChange={handleChange}
          value={requestData.senderEmail}
          type="email"
          name="senderEmail"
          placeholder="e.g johndoe@gmail.com"
          required
        />
      </div>

      {/* Message Rich Text Editor */}
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

      {/* Advanced Options */}
      <section className="flex flex-col space-y-7 mt-10 pt-10">
        {/* Enable Advanced Options Switch */}
        <div className="flex items-center space-x-4">
          <ReactSwitch
            onChange={(e) => {
              setShowAdvanced(e);
              e === false &&
                setRequestData((prev) => ({
                  ...prev,
                  recipientPhoto: "",
                  senderPhoto: "",
                  backgroundImage: "",
                  acceptanceMusic: "",
                }));
            }}
            checked={showAdvanced}
            className="border border-primary"
            offColor="#fff"
            onColor="#DC5B57"
            uncheckedIcon={false}
            checkedIcon={false}
            onHandleColor="#ffffff"
            offHandleColor="#DC5B57"
            activeBoxShadow="undefined"
          />
          <span className="text-secondary">Show Advanced Options</span>
        </div>

        {showAdvanced && (
          <div className="flex flex-col space-y-4">
            {/* Recipient Photo */}
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="recipientPhoto">Recipient Photo</label>
              <input
                className="rounded py-3 w-full px-2 outline-none shadow border border-secondary"
                onChange={uploadFile}
                type="file"
                name="recipientPhoto"
              />
            </div>

            {/* Sender Photo */}
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="senderPhoto">Sender Photo</label>
              <input
                className="rounded py-3 w-full px-2 outline-none shadow border border-secondary"
                onChange={uploadFile}
                type="file"
                name="senderPhoto"
                placeholder="e.g johndoe@gmail.com"
              />
            </div>

            {/* Background Image */}
            {/* <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="backgroundImage">Background Image</label>
              <input
                className="rounded py-3 w-full px-2 outline-none shadow border border-secondary"
                onChange={uploadFile}
                type="file"
                name="backgroundImage"
              />
            </div> */}

            {/* Acceptance Music */}
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="acceptanceMusic">Acceptance Music</label>
              <input
                className="rounded py-3 w-full px-2 outline-none shadow border border-secondary"
                onChange={uploadFile}
                type="file"
                name="acceptanceMusic"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default RequestForms;
