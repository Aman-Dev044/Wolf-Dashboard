import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { HttpError, handler, ok } from "@/lib/http";
import { requireUser } from "@/lib/auth";
import { User } from "@/models/User";

export const dynamic = "force-dynamic";

export const GET = handler(async (req: NextRequest) => {
  const { sub } = requireUser(req);
  await connectDB();
  const user = await User.findById(sub).lean();
  if (!user) throw new HttpError(404, "Account not found");
  return ok({ id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role });
});

export const PATCH = handler(async (req: NextRequest) => {
  const { sub } = requireUser(req);
  const data = z
    .object({ name: z.string().trim().min(2).optional(), phone: z.string().trim().optional() })
    .parse(await req.json());
  await connectDB();
  const user = await User.findByIdAndUpdate(sub, data, { new: true }).lean();
  if (!user) throw new HttpError(404, "Account not found");
  return ok({ id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role });
});
