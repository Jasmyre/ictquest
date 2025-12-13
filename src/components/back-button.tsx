"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

const BackButton = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <Button
      className="border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
      onClick={() => router.back()}
      variant={"outline"}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export default BackButton;
