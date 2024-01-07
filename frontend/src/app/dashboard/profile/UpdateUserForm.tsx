"use client";

import React, { useEffect, useState } from "react";
import { IAuth, IUserProfileData } from "../../../../types";
import { updateUserProfileDetails } from "@/app/actions/user-data";
import { toast } from "react-toastify";
import { initialUserProfileData } from "@/constants";

type UpdateUserFormProps = {
  auth: IAuth | null;
  userData: IUserProfileData;
  setUserData: React.Dispatch<React.SetStateAction<IUserProfileData>>;
  setAuth: React.Dispatch<React.SetStateAction<IAuth | null>>;
};

const UpdateUserForm = ({
  userData,
  setUserData,
  auth,
}: UpdateUserFormProps) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState<IUserProfileData>(
    initialUserProfileData
  );

  useEffect(() => {
    setUpdateFormData((prev) => ({
      firstName: userData.firstName,
      gender: userData.gender,
      dob: userData.dob,
      lastName: userData.lastName,
      ...userData,
    }));
  }, [userData]);

  //   handle form element change event
  const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const name = e.target.name;
      const value = e.target.value;

      setUpdateFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const changeSelectValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setUpdateFormData((prev) => ({ ...prev, gender: e.target.value }));
    }
  };

  // submit form data to backend to update user details
  const submitUserUpdateForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await updateUserProfileDetails(
        updateFormData,
        userData._id,
        auth?.token!
      );

      if (!data?.success) {
        setLoading(false);
        setError(data.message);
        return;
      }

      setUserData((prev) => ({ ...prev, ...data.user }));

      toast.success(data.message);

      setLoading(false);

      setError("");
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  return (
    <form
      onSubmit={submitUserUpdateForm}
      className="flex flex-col space-y-5 border shadow justify-start p-5 mx-auto w-full"
    >
      <h2 className="text-center tracking-wider font-pacifico text-xl md:text-3xl font-semibold text-primary-main dark:text-white">
        Update your profile
      </h2>

      {error && (
        <small className="p-4 rounded bg-red-300/70 text-red-700 text-sm">
          {error}
        </small>
      )}

      <div className="flex flex-col space-y-2">
        <label htmlFor="firstName" className="dark:text-white">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          placeholder="your first name"
          value={updateFormData.firstName}
          onChange={changeInputValue}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="lastName" className="dark:text-white">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          placeholder="your last name"
          value={updateFormData.lastName}
          onChange={changeInputValue}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="dob" className="dark:text-white">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
          value={
            updateFormData.dob
              ? new Date(`${updateFormData.dob}`)?.toISOString()?.split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          onChange={changeInputValue}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="gender" className="dark:text-white">
          Gender
        </label>
        <select
          value={updateFormData.gender}
          onChange={changeSelectValue}
          name="gender"
          className="dark:bg-transparent dark:text-white dark:border-white/60 border border-secondary-subtle/30 shadow focus:border-secondary-subtle rounded py-3 w-full px-2"
        >
          <option
            className="dark:bg-transparent dark:text-black dark:border-white/60"
            value=""
          >
            Choose one
          </option>
          <option
            className="dark:bg-transparent dark:text-black dark:border-white/60"
            value="Man"
          >
            Man
          </option>
          <option
            className="dark:bg-transparent dark:text-black dark:border-white/60"
            value="Woman"
          >
            Woman
          </option>
          <option
            className="dark:bg-transparent dark:text-black dark:border-white/60"
            value="Other"
          >
            Other
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded bg-primary-main border-0 text-white w-full text-center"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default UpdateUserForm;
