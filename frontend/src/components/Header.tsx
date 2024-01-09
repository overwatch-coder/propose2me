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
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import noProfileImage from "@/assets/no-profile-picture.png";
import { useAppContext } from "@/context/AppContext";
import copy from "copy-to-clipboard";
import Image from "next/image";
import DisplayUrls from "./DisplayUrls";
import AccountDropdown from "./AccountDropdown";
import { useTheme } from "next-themes";

const Header = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const {
    toggleNavbar,
    isOpen,
    auth,
    logout,
    urls,
    showAccountDropdown,
    setShowAccountDropdown,
  } = useAppContext();

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
      <div className="flex items-center justify-between px-5 py-3 bg-primary-main shadow-sm">
        {/* Logo */}
        <Link href={"/"} className="text-2xl text-white font-pacifico md:px-10">
          PTM
        </Link>

        {auth?.email && (
          <div
            onClick={() => {
              setDisplayUrls((prev) => !prev);
              !displayUrls && setShowAccountDropdown(false);
            }}
            className="text-base flex flex-row items-center space-x-1 cursor-pointer"
          >
            <p className="capitalize text-white">{auth?.username}'s corner</p>
            {!displayUrls ? (
              <VscChevronDown size={20} className="text-white" />
            ) : (
              <VscChevronUp size={20} className="text-white" />
            )}
          </div>
        )}

        {/* Hamburger Menu */}
        <div className="md:hidden flex items-center space-x-5">
          <span
            className="cursor-pointer"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "light" ? (
              <BsFillMoonStarsFill size={20} className="text-white" />
            ) : (
              <BsFillSunFill size={20} className="text-white" />
            )}
          </span>

          {isOpen ? (
            <VscClose
              onClick={() => {
                toggleNavbar();
                setDisplayUrls(false);
                setShowAccountDropdown(false);
              }}
              size={30}
              className="text-white cursor-pointer "
            />
          ) : (
            <VscMenu
              onClick={() => {
                toggleNavbar();
                setDisplayUrls(false);
                setShowAccountDropdown(false);
              }}
              size={30}
              className="text-white cursor-pointer "
            />
          )}
        </div>

        {/* Desktop Navbar */}
        <nav className="items-center justify-center hidden space-x-4 text-sm text-white uppercase md:flex">
          <span
            className="hidden md:block mx-3 cursor-pointer"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "light" ? (
              <BsFillMoonStarsFill size={25} className="text-white" />
            ) : (
              <BsFillSunFill size={25} className="text-white" />
            )}
          </span>

          <Link
            href={"/"}
            className={`hover:border-b-2 hover:border-white ${
              pathname === "/" && "border-white border-b-2"
            }`}
          >
            Home
          </Link>

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
              className="px-5 py-2 text-black bg-white rounded-full hover:text-primary-main"
            >
              Account
            </Link>
          ) : (
            <button
              onClick={() => {
                setShowAccountDropdown((prev) => !prev);
                !showAccountDropdown && setDisplayUrls(false);
              }}
              className="px-2 py-2 text-black hover:text-primary-main uppercase"
            >
              <Image
                src={
                  auth?.profilePicture ? auth.profilePicture : noProfileImage
                }
                alt="profile picture"
                width={500}
                height={500}
                className="border border-secondary-main object-cover w-8 h-8 rounded-full"
              />
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Navbar */}
      <nav
        className={`flex-col pt-5 pb-10 space-y-5 text-sm px-5 text-white uppercase md:hidden ${
          isOpen ? "flex bg-primary-main" : "hidden"
        } font-medium`}
      >
        <Link
          href={"/"}
          className={`w-fit hover:border-b-2 hover:border-white ${
            pathname === "/" && "border-white border-b-2"
          }`}
        >
          Home
        </Link>

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
            className="px-5 py-2 text-black bg-white rounded hover:text-primary-main text-center"
          >
            Account
          </Link>
        ) : (
          <button
            onClick={() => {
              setShowAccountDropdown((prev) => !prev);
              toggleNavbar();
              !showAccountDropdown && setDisplayUrls(false);
            }}
            className="px-5 py-2 text-black bg-white rounded hover:text-primary-main text-center"
          >
            Account
          </button>
        )}
      </nav>

      {/* All User Urls Available */}
      {auth?.email && (
        <>
          {displayUrls && (
            <DisplayUrls
              setDisplayUrls={setDisplayUrls}
              urls={urls}
              success={success}
              displayUrls={displayUrls}
              copyToClipboard={copyToClipboard}
            />
          )}

          {showAccountDropdown && (
            <AccountDropdown
              showAccountDropdown={showAccountDropdown}
              setShowAccountDropdown={setShowAccountDropdown}
              logout={logout}
            />
          )}
        </>
      )}
    </header>
  );
};

export default Header;
