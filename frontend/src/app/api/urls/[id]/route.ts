import { NextResponse } from "next/server";
import axios from "axios";

export const DELETE = async (
  req: Request,
  { params: { id } }: { params: { id: string } }
) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user");

  try {
    const res = await axios.delete(
      `${process.env.PTM_API_URL}/user/urls?postId=${id}&userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
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
