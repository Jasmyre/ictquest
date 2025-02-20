"use server"

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  const id = session?.user.id ?? null;

  return id;
};

export async function GET() {
    return NextResponse.json({id: await getUserId()});
}