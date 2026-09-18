export function revalidatePath(): void {
  // No-op stub for tests.
}

export function revalidateTag(): void {
  // No-op stub for tests.
}

export function cacheLife(): void {
  // No-op stub for tests.
}

export function cacheTag(): void {
  // No-op stub for tests.
}

export function updateTag(): void {
  // No-op stub for tests.
}

export function unstable_cache<T extends (...args: never[]) => unknown>(
  fn: T
): T {
  return fn;
}
