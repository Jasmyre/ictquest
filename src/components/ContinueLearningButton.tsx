"use client";

import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

interface ProgressEntry {
  topic: string;
  subtopics: string[];
}

export interface UserData {
  name: string;
  email: string;
  progressData: ProgressEntry[];
}

const ContinueLearningButton = ({ ...props }) => {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic")!;
  const router = useRouter();

  const handleClick = async () => {
    router.push(`/lessons/${topic}#`);
  };

  return (
    <Button
      onClick={handleClick}
      {...props}
      className="w-full place-self-end bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
    >
      Continue Learning
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default ContinueLearningButton;
