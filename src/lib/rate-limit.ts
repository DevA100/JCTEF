import "server-only";
import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";

/**
 * Per-IP, per-form rate limit (fixed window), shared across all of Netlify's
 * serverless instances through Netlify Blobs.
 *
 * - Writes are compare-and-swap (onlyIfMatch / onlyIfNew), so two requests
 *   at the same moment can't both slip past the limit.
 * - IPs are stored hashed, never in plain text.
 * - Outside Netlify (local development) there is no Blobs store, so it falls
 *   back to this server's memory.
 * - If Blobs errors or takes longer than BLOBS_TIMEOUT_MS, this request falls
 *   back to this server's memory (logged). A storage hiccup must never block
 *   or hang a genuine person's submission. (A Blobs call that never returned
 *   once made the forms hang until Netlify killed the function, Nov 2026.)
 */
type Bucket = { count: number; resetAt: number };

const memory = new Map<string, Bucket>();
let blobsAvailable: boolean | undefined;
const BLOBS_TIMEOUT_MS = 3_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Netlify Blobs took longer than ${ms} ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function hashKey(scope: string, ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT ?? "jctef";
  return `${scope}/${createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32)}`;
}

function memoryLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (memory.size > 5_000) for (const [k, v] of memory) if (v.resetAt <= now) memory.delete(k);
  const bucket = memory.get(key);
  if (!bucket || bucket.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

async function blobsLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const store = getStore({ name: "form-rate-limits", consistency: "strong" });
  for (let attempt = 0; attempt < 4; attempt++) {
    const now = Date.now();
    const current = await store.getWithMetadata(key, { type: "json" });
    const bucket = current?.data as Bucket | undefined;

    const fresh = !bucket || bucket.resetAt <= now;
    if (!fresh && bucket.count >= limit) return false;
    const next: Bucket = fresh ? { count: 1, resetAt: now + windowMs } : { count: bucket.count + 1, resetAt: bucket.resetAt };

    const result = await store.setJSON(key, next, current?.etag ? { onlyIfMatch: current.etag } : { onlyIfNew: true });
    if (result.modified) return true;
    // Someone else wrote first: read again and retry.
  }
  return true;
}

export async function rateLimit(scope: string, ip: string, { limit, windowMs }: { limit: number; windowMs: number }): Promise<boolean> {
  const key = hashKey(scope, ip);
  if (blobsAvailable !== false) {
    try {
      const allowed = await withTimeout(blobsLimit(key, limit, windowMs), BLOBS_TIMEOUT_MS);
      blobsAvailable = true;
      return allowed;
    } catch (error) {
      if (error instanceof Error && error.name === "MissingBlobsEnvironmentError") {
        blobsAvailable = false; // Not on Netlify: use memory from now on.
      } else {
        console.error("Rate limit: Netlify Blobs failed, using memory for this request:", error instanceof Error ? error.message : error);
      }
    }
  }
  return memoryLimit(key, limit, windowMs);
}
