import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/utils/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.toLowerCase().trim();
    const password = body?.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.password) {
        return NextResponse.json(
          { message: "Account exists with Google sign-in. Use Google login." },
          { status: 409 }
        );
      }

      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.split("@")[0];

    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "Signup successful" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Failed to create account" }, { status: 500 });
  }
}
