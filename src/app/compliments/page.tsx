import { SessionProvider } from "next-auth/react";
import Compliment from "./compliment";

export default async function ComplimentsPage({
  searchParams,
}: {
  searchParams: Promise<{ correct: string; incorrect: string }>;
}) {
  const { correct, incorrect } = await searchParams;

  const image = [
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

  const randomImage = image[Math.floor(Math.random() * image.length)];

  // const compliments = [
  //   { text: "Great job! You've mastered the basics of HTML!", icon: Trophy },
  //   {
  //     text: "Fantastic work! Your coding skills are improving rapidly!",
  //     icon: Star,
  //   },
  //   { text: "You're on fire! Keep up the excellent progress!", icon: ThumbsUp },
  //   {
  //     text: "",
  //     icon: Heart,
  //   },
  //   {
  //     text: "Outstanding performance! You should be proud of yourself!",
  //     icon: Smile,
  //   },
  // ];

  // const compliment =
  //     compliments[Math.floor(Math.random() * compliments.length)];

  return (
    <SessionProvider>
      <Compliment
        img={randomImage}
        correct={Number(correct)}
        incorrect={Number(incorrect)}
      />
    </SessionProvider>
  );
}
