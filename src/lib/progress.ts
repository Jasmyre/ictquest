import { db } from "./db";
import { getUserId } from "./user";

export const getUserProgress = async () => {
  const userId = await getUserId();

  if (!userId) {
    return {
      success: false,
      status: 401,
      message: "Unauthorized. Please log in to view your progress",
    };
  }

  try {
    const progress = await db.progressData.findMany({
      where: { userId },
    });

    return {
      success: true,
      data: progress,
    };
  } catch (error) {
    console.error("getUserProgress error:", error);

    return {
      success: false,
      status: 500,
      message:
        "Unable to load your progress right now. Please try again later.",
    };
  }
};
