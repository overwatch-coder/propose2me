"use client";

import { redirect, usePathname } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { IAccount, IAuth } from "../../types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSavedUrls } from "@/utils";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { initialAuthData } from "@/constants";
import { HelmetProvider } from "react-helmet-async";

type AppContextProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showSentEmail: boolean;
  setShowSentEmail: React.Dispatch<React.SetStateAction<boolean>>;
  userData: IAccount;
  setUserData: React.Dispatch<React.SetStateAction<IAccount>>;
  auth: IAuth | null;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | null>>;
  urls: any;
  setUrls: React.Dispatch<React.SetStateAction<any>>;
  theme: "light" | "dark" | null;
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark" | null>>;
};

const initialValues = {
  isOpen: false,
  setIsOpen: () => false,
  showSentEmail: false,
  setShowSentEmail: () => false,
  userData: initialAuthData,
  setUserData: () => {},
  auth: null,
  setAuth: () => {},
  urls: [],
  setUrls: () => [],
  theme: null,
  setTheme: () => null,
};

export const AppContext = createContext<AppContextProps>(initialValues);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSentEmail, setShowSentEmail] = useState(false);
  const [userData, setUserData] = useState<IAccount>(initialAuthData);
  const [auth, setAuth] = useState<IAuth | null>(null);
  const [urls, setUrls] = useState<any>([]);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  const pathname = usePathname();

  //check theme
  useEffect(() => {
    if (window.matchMedia("(prefers-colors-theme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (theme === "light" || theme === "dark") {
      localStorage.setItem("ptm-theme", JSON?.stringify({ theme }));
    }
  }, [theme]);

  useEffect(() => {
    setIsOpen(false);
    if (!localStorage) {
      return;
    }

    const localThemeString: any =
      localStorage?.getItem("ptm-theme") ??
      JSON.stringify({
        theme: "light",
      });
    const localTheme: any = JSON?.parse(localThemeString) ?? { theme: "light" };
    setTheme(localTheme.theme);
  }, [pathname]);

  //check theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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
    theme,
    setTheme,
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
    userData,
    setUserData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    urls,
    setUrls,
    theme,
    setTheme,
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
    userData,
    setUserData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth,
    logout,
    urls,
    setUrls,
    theme,
    setTheme,
  };
};

export default AppContextProvider;
