import type { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { signToken } from "@/lib/auth";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export const POST = handler(async (req: NextRequest) => {
  const { email, password } = z
    .object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) })
    .parse(await req.json());
  await connectDB();
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, "Incorrect email or password");
  }
  const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
  return ok({ token, user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } });
});
