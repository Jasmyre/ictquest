import { auth } from "@/auth";
import { getUserStats } from "@/data/user";
import { NextResponse } from "next/server";

const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user.id ?? null;
};

export const GET = async () => {
    const id = await getUserId();
    if (!id) {
        return NextResponse.json(null)
    }

    const users = await getUserStats(id);

    return NextResponse.json(users)
}