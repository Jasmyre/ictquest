"use server";

import { auth } from "@/auth";
import { NextResponse } from "next/server";

const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user.id ?? null;
};

export async function GET() {
  return NextResponse.json({ id: await getUserId() });
}
