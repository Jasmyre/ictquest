import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { unlockUserAchievement } from "@/lib/achievement";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { achievementName } = await request.json();

    const result = await unlockUserAchievement(userId, achievementName);

    return NextResponse.json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error unlocking achievement:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
