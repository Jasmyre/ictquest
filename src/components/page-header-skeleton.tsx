import { Skeleton } from "@/components/ui/skeleton";

type PageHeaderSkeletonProps = {
  eyebrowClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

/**
 * Loading mirror of the page header pattern (`docs/design-system.md` §2):
 * eyebrow + title + subtitle skeleton bars. Widths (including vertical rhythm)
 * stay per-site via props so adopting it never changes a page's look.
 */
export function PageHeaderSkeleton({
  eyebrowClassName = "h-4 w-40",
  titleClassName = "mt-3 h-9 w-64 sm:w-80",
  subtitleClassName = "mt-2 h-4 w-52",
}: PageHeaderSkeletonProps) {
  return (
    <>
      <Skeleton className={eyebrowClassName} />
      <Skeleton className={titleClassName} />
      <Skeleton className={subtitleClassName} />
    </>
  );
}
