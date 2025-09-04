import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const wait = (time: number): Promise<unknown> => {
  return new Promise((res) => setTimeout(res, time));
};

export const getSessionStorageItem = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const item = window.sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setSessionStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeSessionStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(key);
  }
};

export const clearSessionStorage = (): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.clear();
  }
};

export const getLocalStorageItem = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const item = window.localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const setLocalStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
};

export const clearLocalStorage = (): void => {
  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }
};

export const toastStyle =
  "border border-gray-400 dark:border-gray-700 text-gray-500 dark:text-gray-bg-gray-100 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 text-gray-500 dark:text-gray-200";

export const toastDescription = (name: string, description: string): string => {
  return `${name} - ${description}`;
};

export function countOccurrences<T>(arr: T[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const item of arr) {
    counts[item as keyof typeof counts] =
      (counts[item as keyof typeof counts] || 0) + 1;
  }

  return counts;
}

export const baseUrl = process.env.NEXTAUTH_URL;
