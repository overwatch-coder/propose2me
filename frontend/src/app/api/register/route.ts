import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
    const data = await req.json();
    const res = await fetch(`${process.env.PTM_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })

    const results = await res.json();

    return NextResponse.json(results);
}