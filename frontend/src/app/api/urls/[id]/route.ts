import { NextResponse } from "next/server";
import axios from "axios";

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
      `${process.env.PTM_API_URL}/user/urls/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authorization}`,
        },
      }
    );

    const results = res.data;

    return NextResponse.json(results);
  } catch (error) {
    const results = {
      success: false,
      message: "No messages available",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return NextResponse.json(results);
  }
};
