import LessonPage from "@/components/Lesson";

export default async function page({
  params,
}: Readonly<{
  params: Promise<{ topic: string; subtopic: string; index: string }>;
}>) {
  const { topic, subtopic, index } = await params;

  return (
    <main>
      <LessonPage topic={topic} subtopic={subtopic} indexString={index} />;
    </main>
  );
}
