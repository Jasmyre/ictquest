import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import Lesson from "@/components/Lesson";
import Loading from "./subtopicLoading";

export default async function page({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ subtopic: string }>;
  searchParams: Promise<{ topic: string; isBackEnabled: string }>;
}>) {
  const { subtopic } = await params;
  const { topic, isBackEnabled } = await searchParams;

  const enabledBack = isBackEnabled ?? false;

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <RenderLessons
          enabledBack={enabledBack}
          subtopic={subtopic}
          topic={topic}
        />
      </Suspense>
    </main>
  );
}

const RenderLessons = async ({
  subtopic,
  topic,
  enabledBack,
}: {
  subtopic: string;
  topic: string;
  enabledBack: string;
}) => {
  "use cache";

  return (
    <SessionProvider>
      <Lesson isBackEnabled={!!enabledBack} subtopic={subtopic} topic={topic} />
    </SessionProvider>
  );
};
