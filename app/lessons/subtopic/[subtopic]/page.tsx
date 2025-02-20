import LessonPage from "@/components/Lesson";
import { SessionProvider } from "next-auth/react";

export default async function page({
  params, searchParams
}: Readonly<{
  params: Promise<{ subtopic: string;}>;
  searchParams: Promise<{ topic: string }>;
}>) {
  const { subtopic } = await params;
  const { topic } = await searchParams

  return (
    <main>
      <SessionProvider>
        <LessonPage topic={topic} subtopic={subtopic} />
      </SessionProvider>
    </main>
  );
}
