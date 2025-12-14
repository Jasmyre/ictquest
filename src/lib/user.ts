import { auth } from "@/auth";

export const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  const id = session?.user.id ?? null;

  return id;
};
