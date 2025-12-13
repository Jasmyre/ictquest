"use server";

import { signOut } from "@/auth";

export const signout = async (): Promise<void> => {
  await signOut();
};
