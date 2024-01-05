"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const Form = () => {
  const pathname = usePathname();
  const { userData, setUserData } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
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

      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="dark:text-white">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-2 md:py-3 w-full px-2"
          placeholder="enter password"
          required
          value={userData.password}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default Form;
