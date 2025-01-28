import LessonPage from "@/components/Lesson";

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
      <LessonPage topic={topic} subtopic={subtopic} />
    </main>
  );
}
