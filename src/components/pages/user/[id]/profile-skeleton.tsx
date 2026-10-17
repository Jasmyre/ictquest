import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading mirror of the public profile shell (#94): header card, the two
 * summary tiles, then the tabs bar and panel. Kept as a page-shaped block
 * (not a `<main>`) so it can drop into the group layout's landmark without
 * nesting a second one — the `/` dashboard skeleton uses the same trick.
 */
export const ProfileSkeleton = () => (
  <output
    aria-busy="true"
    aria-label="Loading profile"
    className="mx-auto block w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    data-testid="profile-skeleton"
  >
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 shrink-0 rounded-full sm:h-20 sm:w-20" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Skeleton className="mx-auto h-9 w-full max-w-md rounded-lg" />

    <Card className="mt-6">
      <CardContent className="space-y-4 pt-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-full" />
      </CardContent>
    </Card>
  </output>
);

export default ProfileSkeleton;
