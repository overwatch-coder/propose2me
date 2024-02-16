"use client";

import { runFireWorks } from "@/lib/fireworks";
import { useEffect, useState } from "react";

type FireWorksProps = {
  senderName: string;
  recipientName: string;
  showFireworks: boolean;
};

const FireWorks = ({ showFireworks }: FireWorksProps) => {
  const [showMessage, setShowMessage] = useState(false);

  // set audio
  useEffect(() => {
    const audio = new Audio("fireworks.mp3");
    if (showFireworks) {
      setShowMessage(true);
      audio.play();
      runFireWorks();
    } else {
      audio.pause();
      setShowMessage(false);
    }
  }, [showFireworks]);

  return (
    <>
      {showMessage && (
        <div className="p-10 text-center mx-auto flex-col mt-16 items-center bg-green-200 rounded text-black space-y-5 max-w-lg">
          <h3 className="text-xl font-semibold">
            Hurray🥳💞💖!
            <br /> Congratulations
            <br />
            Best of luck on your new adventure.
          </h3>
        </div>
      )}
    </>
  );
};

export default FireWorks;
