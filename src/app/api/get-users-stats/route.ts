import { NextResponse } from "next/server";
import { getUsersStats } from "@/data/user";

export const GET = async () => {
  const users = await getUsersStats();

  return NextResponse.json(users);
};
