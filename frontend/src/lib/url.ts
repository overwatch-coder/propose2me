import axios from "axios";

// get saved urls
export const getSavedUrls = async (token: string) => {
  try {
    const res = await fetch("/api/urls", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: 60,
      },
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
export const deleteUrlFromDB = async (requestId: string, userId: string) => {
  try {
    const res = await axios.delete(`/api/urls/${requestId}?user=${userId}`, {
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
