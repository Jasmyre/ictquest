"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const BackButton = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
}) => {
  const router = useRouter();

  return (
    <Button
      className={cn(
        "border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700",
        className
      )}
      onClick={() => router.back()}
      variant={"outline"}
      {...props}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export default BackButton;
