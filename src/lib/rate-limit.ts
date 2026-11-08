import { headers } from "next/headers";

/**
 * Basic fixed-window rate limiter kept in server memory.
 * Good enough to stop a single bot hammering the forms. On serverless hosts
 * each instance has its own memory, so it is a speed bump, not a wall.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(scope: string, { limit, windowMs }: { limit: number; windowMs: number }): Promise<boolean> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();

  // Keep the map small.
  if (buckets.size > 5_000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}
