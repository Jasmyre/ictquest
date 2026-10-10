import LessonCard from "@/components/lesson-card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonView = async () => (
  <main
    aria-busy="true"
    aria-label="Loading lesson content"
    className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
  >
    <header className="max-w-2xl">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="mt-3 h-9 w-64 sm:w-96" />
      <Skeleton className="mt-4 h-2.5 w-full" />
    </header>
    <section className="mt-6">
      <div className="mx-auto w-full max-w-3xl">
        <LessonCard>
          <div className="flex min-h-[65vh] flex-col justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[98%]" />
              <Skeleton className="h-4 w-[95%]" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-[25vh] w-full" />
            </div>
            <div className="mt-6 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:justify-between">
              <Skeleton className="h-9 w-full sm:w-28" />
              <Skeleton className="h-9 w-full sm:w-28" />
            </div>
          </div>
        </LessonCard>
      </div>
    </section>
  </main>
);

export default SkeletonView;
