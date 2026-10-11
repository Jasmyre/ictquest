import { PageHeaderSkeleton } from "@/components/page-header-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSettings() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading settings"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <header className="max-w-2xl">
        <PageHeaderSkeleton
          eyebrowClassName="h-4 w-48"
          subtitleClassName="mt-2 h-4 w-64"
          titleClassName="mt-3 h-9 w-56 sm:w-72"
        />
      </header>
      <div className="mt-6 flex flex-col gap-4 sm:mt-4 md:flex-row md:items-start">
        <Skeleton className="h-52 w-full rounded-xl md:w-56 md:shrink-0" />
        <Skeleton className="h-96 w-full flex-1 rounded-xl" />
      </div>
    </main>
  );
}
