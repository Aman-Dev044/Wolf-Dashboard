import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { signToken } from "@/lib/auth";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

const RegisterInput = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().trim().optional().default(""),
});

export const POST = handler(async (req: NextRequest) => {
  const data = RegisterInput.parse(await req.json());
  await connectDB();
  if (await User.exists({ email: data.email })) throw new HttpError(409, "An account is already registered with that email");
  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    passwordHash: await bcrypt.hash(data.password, 10),
  });
  const token = signToken({ sub: String(user._id), email: user.email, role: "customer" });
  return ok({ token, user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } }, { status: 201 });
});
