"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { VscClose, VscMenu } from "react-icons/vsc";

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-[100] flex flex-col w-screen">
      <div className="flex items-center justify-between z-[80] px-5 py-2 bg-primary shadow-sm">
        {/* Logo */}
        <Link href={"/"} className="text-2xl text-white font-pacifico md:px-16">
          PTM
        </Link>

        {/* Hamburger Menu */}
        <div className="cursor-pointer md:hidden">
          {isOpen ? (
            <VscClose
              onClick={() => setIsOpen((prev) => !prev)}
              size={30}
              className="text-white"
            />
          ) : (
            <VscMenu
              onClick={() => setIsOpen((prev) => !prev)}
              size={30}
              className="text-white"
            />
          )}
        </div>

        {/* Desktop Navbar */}
        <nav className="items-center justify-center hidden space-x-4 text-sm text-white uppercase md:flex">
          <Link
            href={"/request"}
            className={`hover:border-b-2 hover:border-white ${
              pathname === "/request" && "border-white border-b-2"
            }`}
          >
            Request
          </Link>
          <Link
            href={"/about"}
            className={`hover:border-b-2 hover:border-white ${
              pathname === "/about" && "border-white border-b-2"
            }`}
          >
            About
          </Link>
          <Link
            href={"/contact"}
            className={`hover:border-b-2 hover:border-white ${
              pathname === "/contact" && "border-white border-b-2"
            }`}
          >
            Contact
          </Link>
          <Link
            href={"/login"}
            className="px-5 py-2 text-black bg-white rounded-full hover:text-primary"
          >
            Account
          </Link>
        </nav>
      </div>

      {/* Mobile Navbar */}
      <nav
        className={`z-30 flex flex-col py-5 space-y-5 text-sm px-5 text-white uppercase duration-[0.8s] md:hidden ${
          isOpen
            ? "transition translate-y-0 bg-primary"
            : "transition -translate-y-[999px]"
        } font-medium`}
      >
        <Link
          href={"/request"}
          className={`w-fit hover:border-b-2 hover:border-white ${
            pathname === "/request" && "border-white border-b-2"
          }`}
        >
          Request
        </Link>
        <Link
          href={"/about"}
          className={`w-fit hover:border-b-2 hover:border-white ${
            pathname === "/about" && "border-white border-b-2"
          }`}
        >
          About
        </Link>
        <Link
          href={"/contact"}
          className={`w-fit hover:border-b-2 hover:border-white ${
            pathname === "/contact" && "border-white border-b-2"
          }`}
        >
          Contact
        </Link>
        <Link
          href={"/login"}
          className="w-full py-3 text-center text-black transition bg-white rounded-md hover:text-primary hover:font-semibold hover:scale-105"
        >
          Account
        </Link>
      </nav>
    </header>
  );
};

export default Header;
