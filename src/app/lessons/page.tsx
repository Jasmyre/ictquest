import { Suspense } from "react";
import Loading from "./lessonsLoading";
import RenderTopics from "./RenderTopics";

export default async function LessonsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RenderTopics />
    </Suspense>
  );
}
