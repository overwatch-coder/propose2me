"use server";

import { IRequestMessage } from "../../../types";

// get a single request made by user
export const getSpecificRequest = async (token: string, id: string) => {
  const res = await fetch(`${process.env.PTM_API_URL}/auth/requests/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data: IRequestMessage = await res.json();

  return data;
};
