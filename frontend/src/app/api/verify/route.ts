import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { verification } = await req.json();

  const res = await fetch(`${process.env.PTM_API_URL}/auth/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ verificationID: verification }),
  });

  const results = await res.json();

  return NextResponse.json(results);
};
