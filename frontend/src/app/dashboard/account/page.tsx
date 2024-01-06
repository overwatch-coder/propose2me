import React from "react";
import AccountDelete from "./AccountDelete";
import AccountUpdate from "./AccountUpdate";

const AccountPage = () => {
  return (
    <div className="flex flex-col space-y-5 min-h-screen">
      <div className="shadow-md rounded p-4">
        <h2 className="font-semibold font-nunito md:text-2xl text-center">
          Manage Your Account
        </h2>
      </div>

      {/* Update Account Details */}
      <AccountUpdate />

      {/* Delete Your Account */}
      <AccountDelete />
    </div>
  );
};

export default AccountPage;
