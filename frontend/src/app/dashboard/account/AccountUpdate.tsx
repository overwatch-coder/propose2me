import { getAccessToken } from "@/app/actions/get-cookies";
import { getProfileData } from "@/app/actions/user-data";
import React from "react";
import { IUserProfileData } from "../../../../types";
import AccountUpdateForm from "./AccountUpdateForm";

const AccountUpdate = async () => {
  const token = await getAccessToken();
  const userData = await getProfileData(token?.value!);
  const user: IUserProfileData = userData?.user;

  return (
    <section className="shadow-md dark:border-white border-secondary rounded border p-4 flex flex-col space-y-10 mb-auto">
      <AccountUpdateForm user={user} token={token?.value!} />
    </section>
  );
};

export default AccountUpdate;
