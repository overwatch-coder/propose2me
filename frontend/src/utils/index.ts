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

// get saved urls
export const getSavedUrls = async (token: string) => {
  try {
    const res = await axios.get("/api/urls", {
      headers: {
        "Content-Type": "application/json",
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

// save url to database
export const saveUrlToDB = async (data: any, token: string) => {
  try {
    const res = await axios.post("/api/urls", data, {
      headers: {
        "Content-Type": "application/json",
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

// remove url from database
export const deleteUrlToDB = async (id: string, token: string) => {
  try {
    const res = await axios.delete(`/api/urls/${id}`, {
      headers: {
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

// send request email
export const sendRequestEmail = async (template_params: any) => {
  try {
    const res = await axios.post("/api/email", template_params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = res.data;
    const results = {
      success: data === "OK" ? true : false,
      message: "Your response has been successfully sent!",
    };
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
