"use client";

import React, { useState } from "react";
import { IUserProfileData } from "../../../../types";
import { updateUserProfileDetails } from "@/app/actions/user-data";
import Swal from "sweetalert2";
import { useAppContext } from "@/context/AppContext";

type AccountUpdateFormProps = {
  user: IUserProfileData;
  token: string;
};

const AccountUpdateForm = ({ user, token }: AccountUpdateFormProps) => {
  const { setAuth, auth, setUserData } = useAppContext();
  const [userAccountData, setUserAccountData] = useState({
    ...user,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateAccountData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userDataToSubmit = {
      ...userAccountData,
      password: userAccountData.password ? userAccountData.password : undefined,
      email:
        user.email === userAccountData.email
          ? undefined
          : userAccountData.email,
      username:
        user.username === userAccountData.username
          ? undefined
          : userAccountData.username,
    };

    try {
      const data = await updateUserProfileDetails(
        userDataToSubmit,
        user._id,
        token
      );

      if (!data?.success) {
        setLoading(false);
        setError(data.message);
        return;
      }

      Swal.fire({
        title: "Updated!",
        text: data?.message,
        icon: "success",
      });

      setUserData((prev) => ({ ...prev, ...data.user }));

      const authValue = {
        ...auth!,
        username: data.user.username,
        email: data.user.email,
      };

      localStorage.setItem("auth", JSON.stringify({ ...authValue }));
      setAuth({ ...authValue });
      setUserAccountData((prev) => ({ ...prev, password: "" }));

      setLoading(false);
      setError("");
    } catch (error: any) {
      setLoading(false);
      setError("");
      Swal.fire({
        title: "Oops. Something went wrong",
        text: "Please try again later",
        icon: "error",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const name = e.target.name;
      const value = e.target.value;

      setUserAccountData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form
      onSubmit={updateAccountData}
      className="flex flex-col space-y-5 justify-start p-5 mx-auto w-full"
    >
      <h2 className="text-center tracking-wider text-xs dark:text-white/70">
        You can update your username, email and password here
      </h2>

      {error && (
        <small className="p-4 rounded bg-red-300/70 text-red-700 text-sm">
          {error}
        </small>
      )}

      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="dark:text-white">
          Email
        </label>
        <input
          type="text"
          name="email"
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          placeholder={user.email}
          value={userAccountData.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="username" className="dark:text-white">
          Username
        </label>
        <input
          type="text"
          name="username"
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          placeholder={user.username}
          value={userAccountData.username}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="password" className="dark:text-white">
          New Password
        </label>
        <input
          type="password"
          name="password"
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          placeholder="enter new password"
          onChange={handleInputChange}
          value={userAccountData.password}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded bg-primary border-0 text-white w-full text-center"
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default AccountUpdateForm;
