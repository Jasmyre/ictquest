import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  const id = session?.user.id ?? null;
  return id;
};

export async function DELETE() {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await db.progressData.deleteMany({
      where: { userId },
    });
    return NextResponse.json(deleted);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err = error ?? {};
    console.error("Error deleting progress record:", err);

    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "No progress record found with that ID" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete progress" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { topic, subtopics } = await request.json();
    const updated = await db.progressData.update({
      where: { id: params.id },
      data: {
        topic,
        subtopics,
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}
