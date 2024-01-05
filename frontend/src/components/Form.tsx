"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Form = () => {
  const pathname = usePathname();
  const { userData, setUserData } = useAppContext();
  const [viewPassword, setViewPassword] = useState({
    confirm: false,
    pass: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const name = e.currentTarget.name;
    if (name === "passwordField") {
      setViewPassword((prev) => ({ ...prev, pass: !prev.pass }));
    } else {
      setViewPassword((prev) => ({ ...prev, confirm: !prev.confirm }));
    }
  };

  return (
    <>
      {pathname === "/register" && (
        <div className="flex flex-col space-y-2">
          <label htmlFor="username" className="dark:text-white">
            Username
          </label>
          <input
            type="username"
            name="username"
            className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-2 md:py-3 w-full px-2"
            placeholder="your username"
            required
            value={userData.username}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="dark:text-white">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-2 md:py-3 w-full px-2"
          placeholder="your email address"
          required
          value={userData.email}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col space-y-2 relative">
        <label htmlFor="password" className="dark:text-white">
          Password
        </label>
        <input
          type={viewPassword.pass ? "text" : "password"}
          name="password"
          className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-2 md:py-3 w-full px-2"
          placeholder="enter password"
          required
          value={userData.password}
          onChange={handleChange}
        />
        <button
          onClick={handlePasswordChange}
          type="button"
          className="absolute top-10 right-3"
          name="passwordField"
        >
          {viewPassword.pass ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>

      {pathname === "/register" && (
        <div className="flex flex-col space-y-2 relative">
          <label htmlFor="confirmPassword" className="dark:text-white">
            Confirm Password
          </label>
          <input
            type={viewPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-2 md:py-3 w-full px-2"
            placeholder="confirmPassword password"
            required
            value={userData.confirmPassword}
            onChange={handleChange}
          />

          <button
            onClick={handlePasswordChange}
            type="button"
            className="absolute top-10 right-3"
            name="confirmPasswordField"
          >
            {viewPassword.confirm ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      )}
    </>
  );
};

export default Form;
