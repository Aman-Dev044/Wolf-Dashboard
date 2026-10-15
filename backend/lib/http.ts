import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function fail(err: unknown) {
  if (err instanceof HttpError) return NextResponse.json({ error: err.message }, { status: err.status });
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation failed", issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })) },
      { status: 422 }
    );
  }
  const name = (err as { name?: string })?.name;
  if (name === "CastError") return NextResponse.json({ error: "Invalid identifier" }, { status: 400 });
  if (name === "ValidationError") return NextResponse.json({ error: (err as Error).message }, { status: 422 });
  if ((err as { code?: number })?.code === 11000) return NextResponse.json({ error: "That record already exists" }, { status: 409 });
  if (err instanceof SyntaxError) return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

/** Wraps a route handler so thrown errors become JSON responses. */
export function handler<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } catch (err) {
      return fail(err);
    }
  };
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
