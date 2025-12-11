"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function CustomProgress({
  initialValue,
  finalValue,
  delay = 500,
  classname,
}: Readonly<{
  initialValue: number;
  finalValue: number;
  delay?: number;
  classname?: string;
}>) {
  const [progress, setProgress] = React.useState(initialValue);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(finalValue), delay);
    return () => clearTimeout(timer);
  }, [delay, finalValue]);

  return <Progress className={cn("w-full", classname)} value={progress} />;
}
