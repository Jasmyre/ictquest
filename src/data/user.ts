import lessons from "@/db/lessons";
import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        userName: true,
        image: true,
      },
    });
    console.log(users);

    return users;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllUserAchievements = async () => {
  try {
    const userAchievements = await db.userAchievement.findMany({
      select: {
        userId: true,
      },
    });

    const id: string[] = [];

    userAchievements.forEach((item) => {
      id.push(item.userId);
    });

    return id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface GetUsersStats {
  username: string | null;
  id: string;
  avatar: string | null;
  numberOfAchievements: number;
  numberOfSubtopics: number;
  level: string;
  averageProgress: number;
}

export const getUsersStats = async () => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        userName: true,
        image: true,
        userAchievements: {
          select: { id: true },
        },
        progressData: {
          select: { subtopics: true, topic: true },
        },
      },
    });

    const usersStats = users.map((user) => {
      const totalSubtopicsCount = user.progressData.reduce(
        (total, progressItem) => {
          return total + progressItem.subtopics.length;
        },
        0,
      );

      let totalPercentage = 0;
      let lessonsCounted = 0;

      lessons.forEach((lesson) => {
        const progress = user.progressData.find((p) => p.topic === lesson.slug);
        const completedSubtopics = progress ? progress.subtopics.length : 0;
        const totalSubtopicsForLesson = lesson.topics.length;

        if (totalSubtopicsForLesson > 0) {
          const lessonProgress =
            (completedSubtopics / totalSubtopicsForLesson) * 100;
          totalPercentage += lessonProgress;
          lessonsCounted++;
        }
      });

      const averageProgress =
        lessonsCounted > 0 ? totalPercentage / lessonsCounted : 0;

      let level = "";
      if (averageProgress < 33.33) {
        level = "Beginner";
      } else if (averageProgress < 66.67) {
        level = "Intermediate";
      } else {
        level = "Expert";
      }

      return {
        username: user.userName,
        id: user.id,
        avatar: user.image,
        numberOfAchievements: user.userAchievements.length,
        numberOfSubtopics: totalSubtopicsCount,
        level,
        averageProgress: Number(averageProgress.toFixed(2)),
      };
    });

    return usersStats;
  } catch (error) {
    console.error("Error getting user stats", error);
    return [];
  }
};

export const getUserStats = async (userId: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        userName: true,
        image: true,
        userAchievements: { select: { id: true } },
        progressData: { select: { subtopics: true, topic: true } },
      },
    });

    if (!user) {
      console.error("User not found for id:", userId);
      return null;
    }

    const totalSubtopicsCount = user.progressData.reduce(
      (total, progressItem) => {
        return total + progressItem.subtopics.length;
      },
      0,
    );

    let totalPercentage = 0;
    let lessonsCounted = 0;

    lessons.forEach((lesson) => {
      const progress = user.progressData.find((p) => p.topic === lesson.slug);
      const completedSubtopics = progress ? progress.subtopics.length : 0;
      const totalSubtopicsForLesson = lesson.topics.length;

      if (totalSubtopicsForLesson > 0) {
        const lessonProgress =
          (completedSubtopics / totalSubtopicsForLesson) * 100;
        totalPercentage += lessonProgress;
        lessonsCounted++;
      }
    });

    const averageProgress =
      lessonsCounted > 0 ? totalPercentage / lessonsCounted : 0;

    let level = "";
    if (averageProgress < 33.33) {
      level = "Beginner";
    } else if (averageProgress < 66.67) {
      level = "Intermediate";
    } else {
      level = "Expert";
    }

    return {
      username: user.userName,
      id: user.id,
      avatar: user.image,
      numberOfAchievements: user.userAchievements.length,
      numberOfSubtopics: totalSubtopicsCount,
      level,
      averageProgress: Number(averageProgress.toFixed(2)),
    };
  } catch (error) {
    console.error("Error getting user stats", error);
    return null;
  }
};
