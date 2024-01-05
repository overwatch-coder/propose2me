"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { IUserProfileData } from "../../../../types";
import { initialUserProfileData } from "@/constants";
import DisplayUserInfo from "./DisplayUserInfo";
import UpdateUserForm from "./UpdateUserForm";
import { CiLogout } from "react-icons/ci";

const ProfilePage = () => {
  const { auth, setAuth, logout } = useAppContext();
  const [userData, setUserData] = useState<IUserProfileData>(
    initialUserProfileData
  );
  const [loading, setLoading] = useState(false);

  return (
    <section className="flex flex-col space-y-7">
      <button
        className="items-center flex px-2 md:py-3 py-2 bg-primary w-fit md:hidden"
        onClick={logout}
      >
        <CiLogout color={"white"} size={22} />
        <span className="mx-2 text-white font-medium">{"Logout"}</span>
      </button>

      <DisplayUserInfo
        setAuth={setAuth}
        auth={auth}
        loading={loading}
        setLoading={setLoading}
        userData={userData}
        setUserData={setUserData}
      />

      <UpdateUserForm
        setAuth={setAuth}
        auth={auth}
        userData={userData}
        setUserData={setUserData}
      />
    </section>
  );
};

export default ProfilePage;
