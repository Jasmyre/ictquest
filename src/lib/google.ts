"use server"

import { signIn } from "@/auth";

export const handleGoogleSignIn = async () => {
  try {
    await signIn("google", {redirectTo: "/"});
  } catch (err) {
    console.error(err);
  }
};