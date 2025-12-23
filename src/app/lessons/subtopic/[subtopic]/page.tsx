import { Suspense } from "react";
import Lesson from "@/components/pages/lessons/subtopic/lesson";
import Skeleton from "@/components/pages/lessons/subtopic/subtopic-loading";

async function page({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ subtopic: string }>;
  searchParams: Promise<{ topic: string; isBackEnabled: string }>;
}>) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Renderer params={params} searchParams={searchParams} />
    </Suspense>
  );
}

const Renderer = async ({
  params,
  searchParams,
}: {
  params: Promise<{ subtopic: string }>;
  searchParams: Promise<{ topic: string; isBackEnabled: string }>;
}) => {
  "use cache";

  const { subtopic } = await params;
  const { topic, isBackEnabled } = await searchParams;

  const enabledBack = !!isBackEnabled;

  return (
    <Lesson isBackEnabled={enabledBack} subtopic={subtopic} topic={topic} />
  );
};

export default page;
