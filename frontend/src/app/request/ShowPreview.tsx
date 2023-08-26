import { IRequestData } from "../../../types";
import Image from "next/image";
import { Editor } from "@tinymce/tinymce-react";

type ShowPreviewProps = {
  requestData: IRequestData;
};

const ShowPreview = ({ requestData }: ShowPreviewProps) => {
  return (
    <div>
      <section className="relative">
        {/* Overlaying div */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

        {/* Images */}
        {requestData.senderPhoto && (
          <div className="absolute -top-10 left-0 border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] border-white -rotate-[25deg] w-[180px] md:w-[250px] -z-[20]">
            <Image
              src={URL.createObjectURL(requestData?.senderPhoto)}
              alt={requestData.senderName}
              width={700}
              height={700}
              quality={100}
              loading="lazy"
              className="flex-shrink-0 w-full object-contain"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
          </div>
        )}

        {requestData.recipientPhoto && (
          <div className="absolute -top-10 right-0 border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] border-white rotate-[25deg] w-[180px] md:w-[250px] -z-[20]">
            <Image
              src={URL.createObjectURL(requestData?.recipientPhoto)}
              alt={requestData.recipientName}
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
        <form className="flex flex-col space-y-7 mx-auto text-center items-center w-full  h-full relative bg-gray-400 mix-blend-screen py-10 px-2 md:px-8">
          <h2 className="text-base md:text-xl font-bold uppercase mb-2 font-pacifico text-primary animate-pulse">
            A message from <span>{requestData?.senderName}</span> to{" "}
            <span>{requestData?.recipientName}</span>
          </h2>

          <h1 className="text-black font-pacifico text-2xl md:text-4xl font-bold tracking-wider leading-relaxed text-center">
            <span className="animate-pulse">💕</span>
            {requestData?.title} <span className="animate-pulse">💕</span>
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
                value={requestData.message}
              />
            </div>
            <span className="animate-ping absolute bottom-1/2 left-1/3 rotate-45">
              💞💖
            </span>
          </section>
        </form>
      </section>
    </div>
  );
};

export default ShowPreview;
