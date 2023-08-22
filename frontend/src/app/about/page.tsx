import Image from "next/image";
import React from "react";
import aboutHero from "@/assets/about-hero.png";
import { contactDetails, coreValues } from "@/constants";
import { BsTwitter } from "react-icons/bs";
import { IconType } from "react-icons";

export const metadata = {
  title: "About PTM",
  description: "About PTM Website",
};

const AboutPage = () => {
  return (
    <article className="flex flex-col mx-auto items-center gap-y-7">
      <h2 className="uppercase font-bold text-2xl md:text-3xl text-black">
        About PTM
      </h2>

      {/* Mission Statement */}
      <div className="flex flex-col space-y-6 md:flex-row md:justify-between items-center md:space-y-0 md:space-x-10">
        {/* Content */}
        <div className="flex space-y-2 border-2 border-primary p-5 md:p-10 lg:p-16 flex-col items-center md:items-start">
          <h3 className="text-primary font-bold text-xl">Mission Statement</h3>
          <p>
            At PTM, we aim to provide a platform that empowers individuals to
            express their love without fear or anxiety. We strive to make
            proposal planning easy and personalized, offering creative options
            that cater to diverse personalities and preferences.
          </p>
        </div>

        {/* Image */}
        <Image
          src={aboutHero}
          alt="About PTM"
          width={700}
          height={700}
          quality={100}
          loading="lazy"
          className="md:w-[90%] object-contain w-[300px]"
        />
      </div>

      {/* Our Vision */}
      <h3 className="text-xl text-center mt-5 max-w-xl">
        <span className="text-primary font-bold">Our vision</span> is to be the
        go-to platform for individuals looking to create unique and
        unforgettable proposal experiences. We envision a world where love is
        expressed freely and confidently, regardless of personality type or
        social norms.
      </h3>

      {/* Core Values */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center mt-5 gap-7">
        {coreValues.map((value) =>
          value.id === 1 ? (
            <div
              key={value.id}
              className={`text-2xl md:text-4xl flex justify-center items-center uppercase font-bold w-full p-20 sm:p-10 sm:h-full`}
              style={{
                backgroundColor: `#${value.bg}`,
                color: `#${value.color}`,
              }}
            >
              <p>{value.title}</p>
            </div>
          ) : (
            <div
              key={value.id}
              className={`flex flex-col space-y-4} w-full p-5 h-[200px] md:h-full`}
              style={{
                backgroundColor: `#${value.bg}`,
                color: `#${value.color}`,
              }}
            >
              <h3 className="font-semibold text-xl mb-2">{value.title}</h3>
              <p className="text-base opacity-90">{value.desc}</p>
            </div>
          )
        )}
      </section>

      {/* Contact Us */}
      <section
        id="contact-us"
        className="flex items-center justify-end ms-auto mt-10 max-w-lg"
      >
        <div className="p-3 border-primary border-2 shadow flex flex-col space-y-5">
          <h2 className="text-xl md:text-2xl text-primary font-bold">
            {contactDetails.title}
          </h2>
          
          <p className="text-sm text-secondary-subtle">{contactDetails.desc}</p>

          <div className="text-black font-medium flex flex-col space-y-2">
            <p>Email: {contactDetails.email}</p>
            <p>Phone: {contactDetails.phone}</p>
            <p>Address: {contactDetails.address}</p>
          </div>

          <div className="flex items-center space-x-5">
            {contactDetails.socials.map((Social, index) => (
              <Social key={index} size={20} className="hover:scale-110 hover:text-primary cursor-pointer" />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};

export default AboutPage;
