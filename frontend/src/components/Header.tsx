"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { VscClose, VscMenu } from "react-icons/vsc";
import { useAppContext } from "@/context/AppContext";

const Header = () => {
  const pathname = usePathname();
  const { toggleNavbar, isOpen, auth, logout } = useAppContext();

  return (
    <header className="sticky top-0 z-[100] w-screen">
      <div className="flex items-center justify-between px-5 py-3 bg-primary shadow-sm">
        {/* Logo */}
        <Link href={"/"} className="text-2xl text-white font-pacifico md:px-16">
          PTM
        </Link>

        {/* Hamburger Menu */}
        <div className="cursor-pointer md:hidden">
          {isOpen ? (
            <VscClose onClick={toggleNavbar} size={30} className="text-white" />
          ) : (
            <VscMenu onClick={toggleNavbar} size={30} className="text-white" />
          )}
        </div>

        {/* Desktop Navbar */}
        <nav className="items-center justify-center hidden space-x-4 text-sm text-white uppercase md:flex">
          {auth?.email && (
            <Link
              href={"/request"}
              className={`hover:border-b-2 hover:border-white ${
                pathname === "/request" && "border-white border-b-2"
              }`}
            >
              Request
            </Link>
          )}

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

          {!auth?.email ? (
            <Link
              href={"/login"}
              className="px-5 py-2 text-black bg-white rounded-full hover:text-primary"
            >
              Account
            </Link>
          ) : (
            <button
              onClick={logout}
              className="px-5 py-2 text-black bg-white rounded-full hover:text-primary uppercase"
            >
              Logout
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Navbar */}
      <nav
        className={`flex-col pt-5 pb-10 space-y-5 text-sm px-5 text-white uppercase md:hidden ${
          isOpen ? "flex bg-primary" : "hidden"
        } font-medium`}
      >
        {auth?.email && (
          <Link
            href={"/request"}
            className={`w-fit hover:border-b-2 hover:border-white ${
              pathname === "/request" && "border-white border-b-2"
            }`}
          >
            Request
          </Link>
        )}

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

        {!auth?.email ? (
          <Link
            href={"/login"}
            className="px-5 py-2 text-black bg-white rounded-full hover:text-primary"
          >
            Account
          </Link>
        ) : (
          <button
            onClick={logout}
            className="px-5 py-2 text-black bg-white rounded-full hover:text-primary uppercase"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
