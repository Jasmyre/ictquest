import Lesson from "@/components/Lesson";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import Loading from "./loading";

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
      <Suspense fallback={<Loading/>}>
        <SessionProvider>
          <Lesson
            topic={topic}
            subtopic={subtopic}
            isBackEnabled={!!enabledBack}
          />
        </SessionProvider>
      </Suspense>
    </main>
  );
}
