import type { Prisma } from "@prisma/client";
import lessons from "@/db/lessons";

type UserWithProgress = Prisma.UserGetPayload<{
  select: {
    progressData: { select: { subtopics: true; topic: true } };
  };
}>;

export const calculateAverageProgress = ({
  user,
}: {
  user: UserWithProgress;
}) => {
  let totalPercentage = 0;
  let lessonsCounted = 0;

  for (const lesson of lessons) {
    // Find progress data for this lesson
    const progress = user.progressData.find((p) => p.topic === lesson.slug);

    // Calculate completed subtopics for this lesson
    const totalCompletedSubtopics = progress ? progress.subtopics.length : 0;
    const totalSubtopicsForLesson = lesson.topics.length;

    if (totalSubtopicsForLesson > 0) {
      // Calculate lesson progress percentage
      const lessonProgress =
        (totalCompletedSubtopics / totalSubtopicsForLesson) * 100;

      // Accumulate for average calculation
      totalPercentage += lessonProgress;
      lessonsCounted += 1;
    }
  }

  return lessonsCounted > 0 ? totalPercentage / lessonsCounted : 0;
};
