"use client";

import { getProfileData } from "@/app/actions/user-data";
import React, { useEffect, useState } from "react";
import { IUserProfileData } from "../../../../types";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import { initialUserProfileData } from "@/constants";
import { updateUserProfileDetails } from "@/app/actions/user-data";
import Swal from "sweetalert2";

const AccountUpdate = () => {
  const { setAuth, auth } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userAccountData, setUserAccountData] = useState<IUserProfileData>(
    initialUserProfileData
  );

  useEffect(() => {
    const getUserDetails = async () => {
      const data = await getProfileData(auth?.token!);
      if (!data?.success && data?.authError) {
        toast.error(data?.message);
        return redirect("/login");
      }

      if (!data?.success) {
        toast.error(data?.message);
        return;
      }

      setUserAccountData((prev) => ({ ...prev, ...data?.user }));
    };

    getUserDetails();
  }, [auth?.token]);

  // form submit
  const updateAccountData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userDataToSubmit = {
      ...userAccountData,
      password: userAccountData.password ? userAccountData.password : undefined,
      email:
        auth?.email === userAccountData.email
          ? undefined
          : userAccountData.email,
      username:
        auth?.username === userAccountData.username
          ? undefined
          : userAccountData.username,
    };

    try {
      const data = await updateUserProfileDetails(
        userDataToSubmit,
        auth?.id!,
        auth?.token!
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

      const authValue = {
        ...auth!,
        username: data.user.username as string,
        email: data.user.email as string,
        isEmailVerified: data.user.isEmailVerified as boolean,
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
    const name = e.target?.name;
    const value = e.target?.value;

    setUserAccountData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="shadow-md dark:border-white border-secondary-main rounded border p-4 flex flex-col space-y-10 mb-auto">
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
            placeholder={"your email"}
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
            placeholder={"your username"}
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
          className="px-4 py-2 rounded bg-primary-main border-0 text-white w-full text-center"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
    </section>
  );
};

export default AccountUpdate;
