"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";

const PreviousButton = ({
  children = "Previous",
  disabled = false,
}: {
  children?: ReactNode;
  disabled?: boolean;
}) => {
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
      className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-whiteZ"
      variant="outline"
      onClick={() => router.back()}
      disabled={disabled}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export default PreviousButton;
