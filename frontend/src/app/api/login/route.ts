import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  const data = await req.json();
  const res = await fetch(`${process.env.PTM_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const results = await res.json();
  const cookieList = cookies();
  cookieList.set("access_token", results?.token ? results.token : null);

  return NextResponse.json(results);
};
