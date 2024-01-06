"use server";
import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const cookieList = cookies();
  return cookieList.get("access_token");
};
