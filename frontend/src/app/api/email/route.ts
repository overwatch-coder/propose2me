import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req: Request) => {
  try {
    const template_params = await req.json();
    const data = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params,
    };

    const res = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      data,
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
      message: "There was an error sending the request. Try later",
      error: process.env.NODE_ENV !== "production" ? error : "",
    };

    return NextResponse.json(results);
  }
};
