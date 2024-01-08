import axios from "axios";

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

// Update an existing request
export const updateRequest = async (data: any, token: string, id: string) => {
  try {
    const res = await axios.patch(`/api/request/${id}`, data, {
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
    };

    return results;
  }
};

// remove url from database
export const deleteRequest = async (id: string, token: string) => {
  try {
    const res = await axios.delete(`/api/request/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: { success: boolean; message: string } = res.data;
    return data;
  } catch (error: any) {
    const data: { success: boolean; message: string } = {
      success: false,
      message: "Unexpected error encountered. Try again later",
    };

    return data;
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

export const uploadRequestVideoFile = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "unsigned");
  data.append("folder", "ptm/ptm-videos");
  try {
    const url = `https://api.cloudinary.com/v1_1/dmzkknizp/video/upload`;

    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const results = res.data;

    return {
      success: results?.secure_url ? true : false,
      ...results,
    };
  } catch (error: any) {
    const results = {
      success: false,
      message: "There was an error uploading the file. Try again later",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return results;
  }
};
