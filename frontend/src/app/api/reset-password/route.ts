import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { verificationID, password } = await req.json();

  const res = await fetch(`${process.env.PTM_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ verificationID, password }),
  });

  const data = await res.json();

  return NextResponse.json(data);
};
