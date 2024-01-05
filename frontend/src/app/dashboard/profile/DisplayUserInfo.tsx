"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IAuth, IUserProfileData } from "../../../../types";
import noProfileImage from "@/assets/no-profile-picture.png";
import dobToAge from "dob-to-age";
import {
  getProfileData,
  updateUserProfilePicture,
} from "@/app/actions/user-data";
import { toast } from "react-toastify";

export type DisplayUserInfoProps = {
  auth: IAuth | null;
  userData: IUserProfileData;
  setUserData: React.Dispatch<React.SetStateAction<IUserProfileData>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | null>>;
};

const DisplayUserInfo = ({
  userData,
  setUserData,
  loading,
  setLoading,
  auth,
  setAuth,
}: DisplayUserInfoProps) => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const profilePictureRef = useRef<any>();

  useEffect(() => {
    const getUserData = async () => {
      const data = await getProfileData(auth?.token!);

      if (!data?.success) {
        toast.error(data?.message);
        return;
      }

      setUserData((prev) => ({
        ...data.user,
      }));
    };

    getUserData();
  }, [auth?.token, setUserData]);

  // upload profile picture
  const uploadProfilePicture = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("profilePicture", profilePicture!);
    const data = await updateUserProfilePicture(formData, auth?.token!);

    if (!data?.success) {
      setLoading(false);
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    const authValue = {
      ...auth!,
      profilePicture: data.profilePicture as string,
    };
    localStorage.setItem("auth", JSON.stringify({ ...authValue }));
    setAuth({ ...authValue });

    profilePictureRef.current.value = "";
    setLoading(false);
  };

  // function to change profile picture after selecting the file
  const changeProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <section className="flex flex-col space-y-5 border shadow">
      <h2 className="font-pacifico text-center text-xl md:text-3xl font-semibold text-primary dark:text-white tracking-wider pt-5">
        Your Profile
      </h2>

      <div className="flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-5 justify-start p-5">
        <div className="flex flex-col space-y-4 w-64">
          <Image
            src={auth?.profilePicture ? auth.profilePicture : noProfileImage}
            alt="profile picture"
            width={500}
            height={500}
            className="border-2 border-secondary object-cover w-32 h-32 rounded-full"
          />

          <form
            onSubmit={uploadProfilePicture}
            className="w-full flex flex-col space-y-1 items-start"
            encType="multipart/form-data"
          >
            <label htmlFor="file" className="ml-2 dark:text-white">
              Change profile
            </label>
            <input
              type="file"
              name="profilePicture"
              className="w-full py-2 px-2"
              onChange={changeProfilePicture}
              ref={profilePictureRef}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary border-0 text-white w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change"}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-start space-y-3 dark:text-white border-l-2 h-ful px-5 border-secondary-subtle border-t-2 md:border-t-0 pt-5 md:pt-0">
          <p>
            <span className="font-semibold">Username:</span> {auth?.username}
          </p>

          <p>
            <span className="font-semibold">Email:</span> {auth?.email}
          </p>

          <p className={`${userData?.firstName ? "" : "hidden"}`}>
            <span className="font-semibold">First Name:</span>{" "}
            {`${userData.firstName}`}
          </p>

          <p className={`${userData?.lastName ? "" : "hidden"}`}>
            <span className="font-semibold">Last Name:</span>{" "}
            {`${userData.lastName}`}
          </p>

          <p className={`${userData?.dob ? "" : "hidden"}`}>
            <span className="font-semibold">Age:</span>{" "}
            {dobToAge(userData?.dob)}
          </p>

          <p className={`${userData?.gender ? "" : "hidden"}`}>
            <span className="font-semibold">Gender:</span> {userData.gender}
          </p>

          <p>
            <span className="font-semibold">Verified Email:</span>{" "}
            {userData.isEmailVerified ? "Yes" : "No"}
          </p>

          <p className={`${userData?.createdAt ? "" : "hidden"}`}>
            <span className="font-semibold">Created Since:</span>{" "}
            {new Date(userData?.createdAt).getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DisplayUserInfo;