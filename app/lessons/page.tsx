
import { Suspense } from "react";
import RenderTopics from "./RenderTopics";
import Loading from "./loading";

export default async function LessonsPage() {

  return (
    <Suspense fallback={<Loading/>}>
      <RenderTopics/>
    </Suspense>
  );
}
