"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  VscClose,
  VscMenu,
  VscChevronDown,
  VscChevronUp,
} from "react-icons/vsc";
import { useAppContext } from "@/context/AppContext";
import copy from "copy-to-clipboard";

const Header = () => {
  const pathname = usePathname();
  const { toggleNavbar, isOpen, auth, logout, urls } = useAppContext();
  const [displayUrls, setDisplayUrls] = useState(false);
  const [success, setSuccess] = useState({
    status: false,
    url: "",
    copied: false,
  });

  // copy url to clipboard
  const copyToClipboard = (value: string) => {
    copy(value, {
      message: "Link copied",
      format: "text/plain",
      onCopy(clipboardData) {
        setSuccess((prev) => ({ ...prev, copied: true, url: value }));
      },
    });

    setTimeout(() => {
      setSuccess((prev) => ({ ...prev, copied: false, url: "" }));
    }, 2000);
  };

  return (
    <header className="sticky top-0 z-[100] w-screen">
      <div className="flex items-center justify-between px-5 py-3 bg-primary shadow-sm">
        {/* Logo */}
        <Link href={"/"} className="text-2xl text-white font-pacifico md:px-16">
          PTM
        </Link>

        {auth?.email && (
          <div className="text-base flex flex-row items-center space-x-1">
            <p
              onClick={() => {
                setDisplayUrls((prev) => !prev);
              }}
              className="capitalize text-white cursor-pointer"
            >
              {auth?.username}&apos;s corner
            </p>
            {!displayUrls ? (
              <VscChevronDown size={20} className="text-white" />
            ) : (
              <VscChevronUp size={20} className="text-white" />
            )}
          </div>
        )}

        {/* Hamburger Menu */}
        <div className="cursor-pointer md:hidden">
          {isOpen ? (
            <VscClose
              onClick={() => {
                toggleNavbar();
                setDisplayUrls(false);
              }}
              size={30}
              className="text-white"
            />
          ) : (
            <VscMenu
              onClick={() => {
                toggleNavbar();
                setDisplayUrls(false);
              }}
              size={30}
              className="text-white"
            />
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
            className="px-5 py-2 text-black bg-white rounded hover:text-primary text-center"
          >
            Account
          </Link>
        ) : (
          <button
            onClick={logout}
            className="px-5 py-2 text-black bg-white rounded hover:text-primary uppercase text-center"
          >
            Logout
          </button>
        )}
      </nav>

      {/* All User Urls Available */}
      {auth?.email && (
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

          <small className="text-xs pb-5 block">
            NB: Each link expires 5 days after being generated
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
                    {success.copied && url.url === success.url
                      ? "Copied"
                      : url.url}
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <h4>No links available</h4>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
