import { toast } from "react-toastify";
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
    console.log(error);
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
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
    console.log(error);
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
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
    console.log({ error });
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
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
    console.log({ error });
    const results = {
      success: false,
      message: "Unexpected error encountered. Try again later",
    };

    return results;
  }
};
