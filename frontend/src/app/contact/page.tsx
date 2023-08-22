import { contactDetails } from "@/constants";
import React from "react";

export const metadata = {
  title: "Contact Us | PTM",
  description: "Contact PTM Inc",
};

const ContactPage = () => {
  return (
    <section
      id="contact-us"
      className="flex items-center justify-center mx-auto mt-16 max-w-lg"
    >
      <div className="p-3 border-primary border-2 shadow flex flex-col space-y-5">
        <h2 className="text-xl md:text-2xl text-primary font-bold">
          PTM {contactDetails.title}
        </h2>

        <p className="text-sm text-secondary-subtle">{contactDetails.desc}</p>

        <div className="text-black font-medium flex flex-col space-y-2">
          <p>Email: {contactDetails.email}</p>
          <p>Phone: {contactDetails.phone}</p>
          <p>Address: {contactDetails.address}</p>
        </div>

        <div className="flex items-center space-x-5">
          {contactDetails.socials.map((Social, index) => (
            <Social
              key={index}
              size={20}
              className="hover:scale-110 hover:text-primary cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
