"use client";

import { SessionProvider } from "next-auth/react";
import Compliment from "./compliment";
import { Suspense, use } from "react";

export default function ComplimentsPage({
  searchParams,
}: {
  searchParams: Promise<{ correct?: string; incorrect?: string }>;
}) {
  const { correct, incorrect } = use(searchParams);

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
        <Compliment
          correct={Number(correct ?? 0)}
          incorrect={Number(incorrect ?? 0)}
          img={randomImage}
        />
      </SessionProvider>
    </Suspense>
  );
}
