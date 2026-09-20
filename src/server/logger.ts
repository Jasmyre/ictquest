/**
 * Minimal server logger (code-review Standards fix).
 *
 * Service catch blocks previously called `console.error` directly, which
 * the Ultracite standard bans in production code. Diagnostics now route
 * through these helpers: silent under `NODE_ENV=test` so unit runs stay
 * quiet, `console.error` otherwise. No third-party logger is introduced —
 * this is the seam to replace if structured logging ever lands.
 */

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

export function logError(message: string, error: unknown): void {
  if (isTestEnv()) {
    return;
  }
  console.error(message, error);
}

export function logInfo(message: string): void {
  if (isTestEnv()) {
    return;
  }
  console.log(message);
}
