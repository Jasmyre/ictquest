import LessonPage from "@/components/Lesson";

export default async function page({
  params,
}: Readonly<{
  params: Promise<{ topic: string; subtopic: string;}>;
}>) {
  const { topic, subtopic} = await params;

  return (
    <main>
      <LessonPage topic={topic} subtopic={subtopic} />;
    </main>
  );
}
