import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export default function Loading({
  className,
  children,
  ...props
}: Readonly<{ children?: ReactNode; className?: string }>): JSX.Element {
  return (
    <Skeleton
      className={cn(
        "h-[16px] w-full rounded-md bg-gray-300 dark:bg-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </Skeleton>
  );
}
