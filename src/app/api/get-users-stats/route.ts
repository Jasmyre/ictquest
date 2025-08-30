import { getUsersStats } from "@/data/user"
import { NextResponse } from "next/server"

export const GET = async () => {
    const users = await getUsersStats();

    return NextResponse.json(users)
}