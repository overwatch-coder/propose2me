import React from "react";
import { VscClose } from "react-icons/vsc";

type DisplayUrlsProps = {
  urls: any;
  copyToClipboard: (value: string) => void;
  success: {
    status: boolean;
    url: string;
    copied: boolean;
  };
  setDisplayUrls: React.Dispatch<React.SetStateAction<boolean>>;
  displayUrls: boolean;
};

const DisplayUrls = ({
  urls,
  copyToClipboard,
  success,
  setDisplayUrls,
  displayUrls,
}: DisplayUrlsProps) => {
  return (
    <div
      className={`absolute md:top-16 right-0 px-5 py-4 w-full md:w-fit duration-700 bg-primary text-white ${
        displayUrls
          ? "translate-y-0 transition"
          : "transition -translate-y-[9999px]"
      }`}
    >
      <h3 className="pb-2 underline font-semibold text-base flex flex-row items-center justify-between">
        <span>All Generated Links</span>
        <VscClose
          onClick={() => {
            setDisplayUrls(false);
          }}
          size={22}
          className="text-primary w-5 h-5 rounded-full bg-white border-white border cursor-pointer hover:text-white hover:bg-transparent"
        />
      </h3>

      <small className="text-xs pb-5 flex flex-col space-y-1">
        <p>Click on a link to copy it</p>
        <p>NB: Each link is deleted after the recipient has responded.</p>
      </small>

      {urls && urls?.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {urls?.map((url: any, idx: number) => (
            <p
              key={idx}
              onClick={() => copyToClipboard(url.url)}
              className="flex items-center space-x-1 cursor-pointer text-sm"
            >
              <span>{idx + 1}.</span>
              <span className="hover:underline">
                {success.copied && url.url === success.url ? "Copied" : url.url}
              </span>
            </p>
          ))}
        </div>
      ) : (
        <h4>No links available</h4>
      )}
    </div>
  );
};

export default DisplayUrls;
