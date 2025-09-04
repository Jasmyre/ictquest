"use server";

import { LogInSchema } from "../schemas/index";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

import type * as z from "zod";

export const login = async (values: z.infer<typeof LogInSchema>) => {
  const validatedFields = LogInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data as z.infer<
    typeof LogInSchema
  >;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
          break;
        default:
          return { error: "Something went wrong!" };
          break;
      }
    }

    throw error;
  }

  return { success: "Email sent!" };
};
