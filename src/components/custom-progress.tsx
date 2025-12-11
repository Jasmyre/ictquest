"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function CustomProgress({
  initialValue,
  finalValue,
  delay = 500,
  className,
}: Readonly<{
  initialValue: number;
  finalValue: number;
  delay?: number;
  className?: string;
}>) {
  const [progress, setProgress] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(finalValue), delay);
    return () => clearTimeout(timer);
  }, [delay, finalValue]);

  return <Progress className={cn("w-full", className)} value={progress} />;
}
