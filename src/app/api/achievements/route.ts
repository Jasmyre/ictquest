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
    // biome-ignore lint/suspicious/noExplicitAny: Allow all object types for catching errors
  } catch (error: any) {
    console.error("Error unlocking achievement:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
