import { Suspense } from "react";
import Loading from "./lessons-loading";
import RenderTopics from "./render-topics";

export default async function LessonsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RenderTopics />
    </Suspense>
  );
}
