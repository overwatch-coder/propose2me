import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { verification, email } = await req.json();

  const res = await fetch(
    `${process.env.PTM_API_URL}/auth/verify?verification=${verification}&email=${email}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({verification, email})
    }
  );

  const results = await res.json();

  return NextResponse.json(results);
};
