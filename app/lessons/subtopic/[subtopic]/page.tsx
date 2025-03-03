import Lesson from "@/components/Lesson";
import { SessionProvider } from "next-auth/react";

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
      <SessionProvider>
        <Lesson topic={topic} subtopic={subtopic} isBackEnabled={!!enabledBack} />
      </SessionProvider>
    </main>
  );
}
