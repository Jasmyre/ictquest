import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user.id ?? null;
};

export async function GET() {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json(
      { message: "Please log in or create an account!" },
      { status: 401 },
    );
  }

  const userAchievement = await db.userAchievement.findMany({
    where: { userId: userId },
    include: { achievement: true },
  });

  return NextResponse.json(userAchievement);
}

export async function DELETE() {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await db.userAchievement.deleteMany({
      where: { userId },
    });

    return NextResponse.json(deleted);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting achievement records:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "No achievement record found for this user" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete achievement records" },
      { status: 500 },
    );
  }
}
