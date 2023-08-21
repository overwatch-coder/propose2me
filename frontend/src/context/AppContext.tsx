"use client";

import { redirect, usePathname } from "next/navigation";
import React, { createContext, useState, useContext, useEffect } from "react";
import { IAccount, IAuth } from "../../types";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type AppContextProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showSentEmail: boolean;
  setShowSentEmail: React.Dispatch<React.SetStateAction<boolean>>;
  userData: IAccount;
  setUserData: React.Dispatch<React.SetStateAction<IAccount>>;
  auth: IAuth | null;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | null>>;
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

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if(!localStorage){
      return
    }
    const localItem = localStorage?.getItem('auth') ?? "";
    const user = localItem !== "" ? JSON.parse(localItem) : "";
    if(user !== ""){
      setAuth(user);
    }
  }, [])

  const values = {
    isOpen,
    setIsOpen,
    userData,
    setUserData,
    showSentEmail,
    setShowSentEmail,
    auth,
    setAuth
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
    setAuth
  } = useContext(AppContext);

  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

   const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null)
    redirect('/login')
  }

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
    logout
  };
};

export default AppContextProvider;
