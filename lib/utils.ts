import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
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

export const wait = (time: number) => {
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
