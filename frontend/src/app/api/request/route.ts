import { NextResponse } from "next/server";
import axios from 'axios';

export const POST = async (req: Request) => {
    // get the form data from the frontend 
  const formData = await req.formData();

//   get the token from the request headers
  const authorization = req.headers.has("Authorization")
    ? req.headers.get("Authorization")
    : undefined;

    //   call the backend api to process the request
    const res = await axios.post(`${process.env.PTM_API_URL}/auth/posts`, formData, {
        headers: {
            "Content-Type": "mutlipart/form-data",
            Authorization: `${authorization}`
        }
    })

    const results = res.data

    return NextResponse.json(results);
};
