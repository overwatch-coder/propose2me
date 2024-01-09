"use client";

import { redirect, usePathname } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { IAccount, IAuth, IUrls } from "../../types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSavedUrls } from "@/lib/url";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { initialUserAccountData } from "@/constants";
import { HelmetProvider } from "react-helmet-async";

type AppContextProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showAccountDropdown: boolean;
  setShowAccountDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  showSentEmail: boolean;
  setShowSentEmail: React.Dispatch<React.SetStateAction<boolean>>;
  userAccountData: IAccount;
  setUserAccountData: React.Dispatch<React.SetStateAction<IAccount>>;
  auth: IAuth | null;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | null>>;
  urls: IUrls[];
  setUrls: React.Dispatch<React.SetStateAction<IUrls[]>>;
};

const initialValues = {
  isOpen: false,
  setIsOpen: () => false,
  showSentEmail: false,
  setShowSentEmail: () => false,
  userAccountData: initialUserAccountData,
  setUserAccountData: () => {},
  auth: null,
  setAuth: () => {},
  urls: [],
  setUrls: () => [],
  setShowAccountDropdown: () => false,
  showAccountDropdown: false,
};

export const AppContext = createContext<AppContextProps>(initialValues);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSentEmail, setShowSentEmail] = useState(false);
  const [userAccountData, setUserAccountData] = useState<IAccount>(
    initialUserAccountData
  );
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [urls, setUrls] = useState<IUrls[]>([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage) {
      return;
    }

    const localAuthItem = localStorage?.getItem("auth") ?? "";
    const user = localAuthItem !== "" ? JSON.parse(localAuthItem) : "";
    if (user !== "") {
      setAuth(user);
    }

    if (auth?.token) {
      const getUrls = async () => {
        const savedUrls = await getSavedUrls(auth?.token as string);
        setUrls(savedUrls?.data);
      };

      getUrls();
    }
  }, [auth?.token]);

  useEffect(() => {
    setIsOpen(false);
    setShowAccountDropdown(false);
    setUserAccountData(initialUserAccountData);
  }, [pathname]);

  const values = {
    isOpen,
    setIsOpen,
    userAccountData,
    setUserAccountData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    urls,
    setUrls,
    showAccountDropdown,
    setShowAccountDropdown,
  };

  return (
    <AppContext.Provider value={values}>
      <>
        <GoogleAnalytics trackPageViews={true} strategy="lazyOnload" />
        <HelmetProvider>{children}</HelmetProvider>
        <ToastContainer />
      </>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const {
    isOpen,
    setIsOpen,
    userAccountData,
    setUserAccountData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    urls,
    setUrls,
    showAccountDropdown,
    setShowAccountDropdown,
  } = useContext(AppContext);

  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const logout = (): void => {
    localStorage.removeItem("auth");
    setAuth(null);
    return redirect("/login");
  };

  return {
    isOpen,
    setIsOpen,
    toggleNavbar,
    userAccountData,
    setUserAccountData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    logout,
    urls,
    setUrls,
    showAccountDropdown,
    setShowAccountDropdown,
  };
};

export default AppContextProvider;
