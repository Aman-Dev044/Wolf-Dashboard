import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { handler, ok } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await connectDB();
  return ok({ status: "ok", db: mongoose.connection.name, time: new Date().toISOString() });
});
