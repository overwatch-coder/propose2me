"use client";

import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { IUserProfileData } from "../../../../types";
import { initialUserProfileData } from "@/constants";
import DisplayUserInfo from "./DisplayUserInfo";
import UpdateUserForm from "./UpdateUserForm";

const ProfilePage = () => {
  const { auth, setAuth } = useAppContext();
  const [userData, setUserData] = useState<IUserProfileData>(
    initialUserProfileData
  );
  const [loading, setLoading] = useState(false);

  return (
    <section className="flex flex-col space-y-7">
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
