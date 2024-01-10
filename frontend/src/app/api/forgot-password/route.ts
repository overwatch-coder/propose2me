import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email } = await req.json();

  const res = await fetch(`${process.env.PTM_API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  return NextResponse.json(data);
};
