"use server";

import { NextResponse } from "next/server";
import { auth } from "@/auth";

const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user.id ?? null;
};

export async function GET() {
  return NextResponse.json({ id: await getUserId() });
}
