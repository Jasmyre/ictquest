import React from 'react'
import { Skeleton } from "./ui/skeleton"
import { cn } from "@/lib/utils"

export default function Loading({className, ...props}: Readonly<{className?: string}>) {
  return (
    <Skeleton
      className={cn(
        "w-full h-[16px] rounded-md bg-gray-300 dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}
