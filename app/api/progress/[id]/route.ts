import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const userId = id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const progress = await db.progressData.findMany({
      where: { userId },
    });
    return NextResponse.json(progress);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const { topic, subtopics } = await request.json();
    const updated = await db.progressData.update({
      where: { id },
      data: { topic, subtopics },
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
