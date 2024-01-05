import React from "react";

const Footer = () => {
  return (
    <footer className="py-3 mt-16 text-xs text-center text-white md:text-base bg-primary font-pacifico">
      <p className="flex items-center justify-center">
        Copyright &copy; PTM {new Date().getFullYear()} All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
