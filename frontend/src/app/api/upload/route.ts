import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const data = await req.formData();
    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload`;
    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    const results = res.data;
    return NextResponse.json(results);
  } catch (error: any) {
    const results = {
      success: false,
      message: "There was an error uploading the file. Try again later",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return NextResponse.json(results);
  }
};
