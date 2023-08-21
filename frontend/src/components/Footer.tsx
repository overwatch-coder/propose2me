import React from "react";

const Footer = () => {
  return (
    <footer className="py-5 mt-20 text-sm text-center text-white md:text-base bg-primary font-pacifico">
      <p className="flex items-center justify-center">
        Copyright &copy; PTM {new Date().getFullYear()} All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
