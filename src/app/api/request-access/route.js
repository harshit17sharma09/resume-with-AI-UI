import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { detail: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userEmail = body.email;

    if (!userEmail) {
      return NextResponse.json(
        { detail: "Email is required" },
        { status: 400 }
      );
    }

    // Here you can add your logic to handle the access request
    // For example, storing it in a database

    return NextResponse.json({
      message: "Access request submitted successfully",
      email: userEmail
    });

  } catch (error) {
    console.error("Request access error:", error);
    return NextResponse.json(
      { detail: error.message },
      { status: 500 }
    );
  }
}
