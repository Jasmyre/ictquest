"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { redirect: true, callbackUrl: "/" });
    } catch (err) {
      console.error("Error signin with google:", err);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      style={{
        padding: "8px 16px",
        background: "#4285F4",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
      }}
    >
      Continue with Google
    </button>
  );
}
