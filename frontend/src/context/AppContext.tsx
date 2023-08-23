"use client";

import { redirect, usePathname } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { IAccount, IAuth, IUserUrls } from "../../types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AppContextProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showSentEmail: boolean;
  setShowSentEmail: React.Dispatch<React.SetStateAction<boolean>>;
  userData: IAccount;
  setUserData: React.Dispatch<React.SetStateAction<IAccount>>;
  auth: IAuth | null;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | null>>;
  urls: IUserUrls[] | null;
  setUrls: React.Dispatch<React.SetStateAction<IUserUrls[] | null>>;
};

const initialValues = {
  isOpen: false,
  setIsOpen: () => false,
  showSentEmail: false,
  setShowSentEmail: () => false,
  userData: {
    username: "",
    email: "",
    password: "",
  },
  setUserData: () => {},
  auth: null,
  setAuth: () => {},
  urls: null,
  setUrls: () => [],
};

export const AppContext = createContext<AppContextProps>(initialValues);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSentEmail, setShowSentEmail] = useState(false);
  const [userData, setUserData] = useState<IAccount>({
    username: "",
    email: "",
    password: "",
  });
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [urls, setUrls] = useState<IUserUrls[] | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!localStorage) {
      return;
    }
    const localAuthItem = localStorage?.getItem("auth") ?? "";
    const user = localAuthItem !== "" ? JSON.parse(localAuthItem) : "";
    if (user !== "") {
      setAuth(user);
    }

    let localUrlItems = JSON.parse(
      localStorage?.getItem("user_urls") as string
    );
    if (localUrlItems === null) {
      setUrls(null);
    } else {
      setUrls(localUrlItems);
    }
  }, []);

  const values = {
    isOpen,
    setIsOpen,
    userData,
    setUserData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    urls,
    setUrls,
  };

  return (
    <AppContext.Provider value={values}>
      <>
        {children}
        <ToastContainer />
      </>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const {
    isOpen,
    setIsOpen,
    userData,
    setUserData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    urls,
    setUrls,
  } = useContext(AppContext);

  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    return redirect("/login");
  };

  return {
    isOpen,
    setIsOpen,
    toggleNavbar,
    userData,
    setUserData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    logout,
    urls,
    setUrls,
  };
};

export default AppContextProvider;
