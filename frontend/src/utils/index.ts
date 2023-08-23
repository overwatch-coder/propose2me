import { IAccount } from "../../types";
import axios from "axios";

// Login or Register An Account
export const loginOrRegisterAccount = async (
  endpoint: string,
  data: IAccount
) => {
  const url = `/api${endpoint}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const results = await res.json();

    return results;
  } catch (error: any) {
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return results;
  }
};

// Verify An Existing Account
export const verifyAccount = async (verification: string, email: string) => {
  try {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verification, email }),
    });

    const results = await res.json();

    return results;
  } catch (error: any) {
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return results;
  }
};

// Create a new request
export const createRequest = async (data: any, token: string) => {
  try {
    const res = await axios.post("/api/request", data, {
      headers: {
        "Content-Type": "mutlipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    const results = res.data;

    return results;
  } catch (error: any) {
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return results;
  }
};

// get recipient information
export const getRecipientMessage = async (data: any) => {
  try {
    const res = await axios.post("/api/recipient", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const results = res.data;

    return results;
  } catch (error: any) {
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return results;
  }
};

// Save Items to local storage
export const saveUrlsToStorage = (data: any) => {
  let existingItems = JSON.parse(localStorage.getItem("user_urls") as string);
  if (existingItems === null) {
    existingItems = [];
  }

  existingItems.push(data);

  localStorage.setItem("user_urls", JSON.stringify(existingItems));

  return existingItems;
};
