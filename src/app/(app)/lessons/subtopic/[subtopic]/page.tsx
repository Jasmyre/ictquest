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

/**
 * Cache policy (migration 09, #32 — see `src/lib/lessons/cache.ts`): lesson
 * reads are static, keyed by route params only. Per-user progress writes
 * happen client-side through uncached tRPC mutations (`userRouter`), so they
 * always stay fresh.
 */
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
