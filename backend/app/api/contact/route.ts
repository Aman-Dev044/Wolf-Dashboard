import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { handler, ok } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { Contact } from "@/models/Messages";

export const dynamic = "force-dynamic";

const ContactInput = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().min(6, "Please enter a phone number"),
  store: z.string().trim().optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
});

export const POST = handler(async (req: NextRequest) => {
  const data = ContactInput.parse(await req.json());
  await connectDB();
  await Contact.create(data);
  return ok({ message: "Thank you for your message. It has been sent." }, { status: 201 });
});

export const GET = handler(async (req: NextRequest) => {
  requireAdmin(req);
  await connectDB();
  const items = await Contact.find().sort({ createdAt: -1 }).limit(200).lean();
  return ok(items);
});
