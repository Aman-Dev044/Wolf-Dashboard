import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { handler, ok } from "@/lib/http";
import { requireAdmin } from "@/lib/auth";
import { SiteContent } from "@/models/Messages";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await connectDB();
  const doc = await SiteContent.findOne({ key: "site" }).lean();
  return ok(doc?.data ?? {});
});

/** Admin: shallow-merge top-level sections of the site content. */
export const PUT = handler(async (req: NextRequest) => {
  requireAdmin(req);
  await connectDB();
  const patch = (await req.json()) as Record<string, unknown>;
  const doc = await SiteContent.findOne({ key: "site" });
  const data = { ...((doc?.data as Record<string, unknown>) || {}), ...patch };
  await SiteContent.updateOne({ key: "site" }, { $set: { data } }, { upsert: true });
  return ok(data);
});
