import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { HttpError } from "./http";

export type TokenPayload = { sub: string; email: string; role: "customer" | "admin" };

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return s;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, secret(), { expiresIn: "7d" });
}

export function readToken(req: NextRequest): TokenPayload | null {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, secret()) as TokenPayload;
  } catch {
    return null;
  }
}

export function requireUser(req: NextRequest) {
  const user = readToken(req);
  if (!user) throw new HttpError(401, "Please sign in to continue");
  return user;
}

export function requireAdmin(req: NextRequest) {
  const user = requireUser(req);
  if (user.role !== "admin") throw new HttpError(403, "Admin access required");
  return user;
}
