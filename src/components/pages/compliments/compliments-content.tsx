import { z } from "zod";
import lessons from "@/db/lessons";
import { api } from "@/trpc/server";
import ComplimentsUI from "./compliments-ui"; // client component

type Props = {
  searchParams: Promise<{ correct?: string; incorrect?: string }>;
};

export default async function ComplimentsContent({ searchParams }: Props) {
  const rawParams = await searchParams;

  const parsed = z
    .object({
      correct: z.coerce.number().int().min(0).catch(0),
      incorrect: z.coerce.number().int().min(0).catch(0),
    })
    .parse(rawParams);

  const { correct, incorrect } = parsed;
  const getProgress = await api.user.getUserProgress({});
  const data = getProgress.data;

  const { totalPercentage, count } = lessons.reduce(
    (acc, lesson) => {
      const progress = data.find((item) => item.topic === lesson.slug);
      const completedSubtopics = progress?.subtopics?.length ?? 0;
      const totalSubtopics = lesson.topics.length;

      if (totalSubtopics > 0) {
        acc.totalPercentage += (completedSubtopics / totalSubtopics) * 100;
        acc.count += 1;
      }
      return acc;
    },
    { totalPercentage: 0, count: 0 }
  );

  const averageProgress = count > 0 ? totalPercentage / count : 0;
  const average =
    correct + incorrect > 0 ? (correct / (correct + incorrect)) * 100 : 0;

  const images = [
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f929/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f603/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f600/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f601/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1fae1/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1fae3/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62f/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f607/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f913/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f60e/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f978/512.gif",
    "https://fonts.gstatic.com/s/e/notoemoji/latest/1f996/512.gif",
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // pass simple serializable props to the client component
  return (
    <ComplimentsUI
      average={average}
      averageProgress={averageProgress}
      correct={correct}
      incorrect={incorrect}
      randomImage={randomImage}
    />
  );
}
