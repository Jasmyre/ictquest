import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfile() {
  return (
    <div className="py-10">
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-1/3" />
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 px-4 py-8 sm:px-0 md:grid-cols-2">
            <div className="border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="mt-4 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="mt-4 space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-1/2" />
                </li>
                <li className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-1/2" />
                </li>
                <li className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-1/2" />
                </li>
              </ul>
            </div>
            {/* Delete Data Button Skeleton */}
            <div className="flex items-center justify-center border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
