"use client";

export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api";

export class ApiError extends Error {
  constructor(message: string, public status: number, public issues: { path: string; message: string }[] = []) {
    super(message);
  }
}

/** Browser-side JSON request to the backend. Attaches the stored auth token when present. */
export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.json !== undefined) headers.set("Content-Type", "application/json");
  try {
    const token = localStorage.getItem("wolf:token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  } catch {}
  let res: Response;
  try {
    res = await fetch(`${PUBLIC_API}${path}`, {
      ...init,
      headers,
      body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
    });
  } catch {
    throw new ApiError("We couldn't reach the server. Please check your connection and try again.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const issues = (data.issues as { path: string; message: string }[]) || [];
    throw new ApiError(issues[0]?.message || data.error || "Something went wrong", res.status, issues);
  }
  return data as T;
}
