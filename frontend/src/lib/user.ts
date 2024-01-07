import { IAccount } from "../../types";

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
