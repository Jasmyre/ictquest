// src/lib/env.ts
export const getCurrentHostname = (): string =>
  typeof window !== "undefined" ? window.location.hostname : "";

export const getCurrentOrigin = (): string =>
  typeof window !== "undefined" ? window.location.origin : "";

/**
 * Navigate to an external URL. Wrapped so tests can mock it.
 */
export const navigateTo = (url: string): void => {
  if (typeof window !== "undefined" && typeof window.location !== "undefined") {
    // use assign to express navigation intent
    window.location.assign(url);
  }
};
