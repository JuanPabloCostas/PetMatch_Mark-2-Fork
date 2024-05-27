import { NextResponse, NextRequest } from "next/server";

export async function POST( reques : NextRequest) {
    const data = await reques.json();

    console.log(data);

    return NextResponse.json({ message: "User created" });
}