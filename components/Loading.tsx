import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function Loading({
  className,
  children,
  ...props
}: Readonly<{ children?: ReactNode; className?: string }>) {
  return (
    <Skeleton
      className={cn(
        "h-[16px] w-full rounded-md bg-gray-300 dark:bg-gray-700",
        className,
      )}
      {...props}
    >
      {children}
    </Skeleton>
  );
}
