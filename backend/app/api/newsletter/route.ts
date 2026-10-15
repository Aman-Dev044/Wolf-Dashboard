import type { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { handler, ok } from "@/lib/http";
import { Subscriber } from "@/models/Messages";

export const dynamic = "force-dynamic";

export const POST = handler(async (req: NextRequest) => {
  const { email } = z.object({ email: z.string().trim().email("Please enter a valid email") }).parse(await req.json());
  await connectDB();
  await Subscriber.updateOne({ email: email.toLowerCase() }, { $setOnInsert: { email } }, { upsert: true });
  return ok({ message: "You're subscribed! Watch your inbox for special offers." }, { status: 201 });
});
