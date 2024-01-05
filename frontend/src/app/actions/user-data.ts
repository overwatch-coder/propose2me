"use server";

import axios from "axios";
import { IUserProfileData } from "../../../types";

export const getProfileData = async (token: string) => {
  const resData = await axios.get(
    `${process.env.PTM_API_URL}/auth/users/user`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await resData.data;

  return data;
};

export const updateUserProfilePicture = async (
  formData: FormData,
  token: string
) => {
  const resData = await axios.patch(
    `${process.env.PTM_API_URL}/auth/profile`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await resData.data;
  return data;
};

export const updateUserProfileDetails = async (
  userData: IUserProfileData,
  id: string,
  token: string
) => {
  const res = await fetch(`${process.env.PTM_API_URL}/auth/users/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  return data;
};
