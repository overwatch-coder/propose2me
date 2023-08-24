import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const res = await axios.post(`${process.env.PTM_API_URL}/recipient`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
