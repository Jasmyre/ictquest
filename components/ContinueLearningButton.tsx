"use client";

import React from "react";

import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

const ContinueLearningButton = () => {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  return (
    <Link href={`/lessons/${topic}`}>
      <Button className="w-full place-self-end bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600">
        Continue Learning
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  );
};

export default ContinueLearningButton;
