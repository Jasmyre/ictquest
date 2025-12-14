import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getUserProgress } from "@/lib/progress";

const getUserId = async (): Promise<string | null> => {
  const session = await auth();
  const id = session?.user.id ?? null;

  return id;
};

export async function GET(_request: NextRequest) {
  const data = await getUserProgress();

  if (!data.success) {
    return NextResponse.json(data, {
      status: data.status,
    });
  }

  return NextResponse.json(data);
}

export async function DELETE(_request: NextRequest) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleted = await db.progressData.deleteMany({
      where: { userId },
    });
    return NextResponse.json(deleted);
    // biome-ignore lint/suspicious/noExplicitAny: Allow type any for catching error
  } catch (error: any) {
    const err = error ?? {};
    console.error("Error deleting progress record:", err);

    if (err.code === "P2025") {
      return NextResponse.json(
        { error: "No progress record found with that ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { topic, subtopic } = await request.json();

    const existing = await db.progressData.findFirst({
      where: { userId, topic },
    });

    if (existing) {
      if (!existing.subtopics.includes(subtopic)) {
        const updated = await db.progressData.update({
          where: { id: existing.id },
          data: { subtopics: [...existing.subtopics, subtopic] },
        });
        return NextResponse.json(updated);
      }
      return NextResponse.json(existing);
    }
    const newEntry = await db.progressData.create({
      data: {
        userId,
        topic,
        subtopics: [subtopic],
      },
    });
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create progress" },
      { status: 500 }
    );
  }
}
