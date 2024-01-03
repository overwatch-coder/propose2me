"use client";

import { Fireworks } from "fireworks/lib/react";
import { useEffect, useState } from "react";

type FireWorksProps = {
  senderName: string;
  recipientName: string;
  showFireworks: boolean;
};

const FireWorks = ({ showFireworks }: FireWorksProps) => {
  const fireworksColors = ["#00FF00", "#FF1493", "#FFFF00"];

  let fxProps = {
    count: 3,
    interval: 400,
    colors: fireworksColors,
    calc: (props: any, i: number) => ({
      ...props,
      x: (i + 1) * (window.innerWidth / 3) - (i + 1) * 100,
      y: 200 + Math.random() * 100 - 50 + (i === 2 ? -80 : 0),
    }),
  };

  const [showMessage, setShowMessage] = useState(false);

  // set audio
  useEffect(() => {
    const audio = new Audio("fireworks.mp3");
    if (showFireworks) {
      setShowMessage(true);
      audio.play();
    } else {
      audio.pause();
      setShowMessage(false);
    }
  }, [showFireworks]);

  return (
    <>
      <Fireworks {...fxProps} />

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
