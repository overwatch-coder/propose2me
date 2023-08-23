import { NextResponse } from "next/server";
import axios from "axios";

// get all user links
export const GET = async (req: Request) => {
  //   get the token from the request headers
  const authorization = req.headers.has("Authorization")
    ? req.headers.get("Authorization")
    : undefined;

  //   call the backend api to process the request
  const res = await axios.get(`${process.env.PTM_API_URL}/user/urls`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${authorization}`,
    },
  });

  const results = res.data;

  return NextResponse.json(results);
};

// save new link to database
export const POST = async (req: Request) => {
  const data = await req.json();

  const authorization = req.headers.has("Authorization")
    ? req.headers.get("Authorization")
    : undefined;

  //   call the backend api to process the request
  const res = await axios.post(`${process.env.PTM_API_URL}/user/urls`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${authorization}`,
    },
  });

  const results = res.data;

  return NextResponse.json(results);
};
