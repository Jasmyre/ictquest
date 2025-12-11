"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import type { JSX, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const PreviousButton = ({
  children = "Previous",
  disabled = false,
}: {
  children?: ReactNode;
  disabled?: boolean;
}): JSX.Element | null => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      className="border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-whiteZ dark:hover:bg-gray-700"
      disabled={disabled}
      onClick={() => router.back()}
      variant="outline"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export default PreviousButton;
