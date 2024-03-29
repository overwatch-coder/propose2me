import { NextResponse } from "next/server";
import axios from "axios";

// Update an existing user request
export const PATCH = async (
  req: Request,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    // get the form data from the frontend
    const formData = await req.formData();

    //   get the token from the request headers
    const authorization = req.headers.has("Authorization")
      ? req.headers.get("Authorization")
      : undefined;

    const res = await axios.patch(
      `${process.env.PTM_API_URL}/auth/requests/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "mutlipart/form-data",
          Authorization: `${authorization}`,
        },
      }
    );

    const results = res.data;

    return NextResponse.json(results);
  } catch (error: any) {
    const results = {
      success: false,
      message: error?.message,
    };

    return NextResponse.json(results);
  }
};

// Delete a specific request from a user
export const DELETE = async (
  req: Request,
  { params: { id } }: { params: { id: string } }
) => {
  try {
    //   get the token from the request headers
    const authorization = req.headers.has("Authorization")
      ? req.headers.get("Authorization")
      : undefined;

    const res = await axios.delete(
      `${process.env.PTM_API_URL}/auth/requests/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authorization}`,
        },
      }
    );

    const results = res.data;

    return NextResponse.json(results);
  } catch (error: any) {
    const results = {
      success: false,
      message: error?.message,
    };

    return NextResponse.json(results);
  }
};
