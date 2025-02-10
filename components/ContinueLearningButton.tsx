"use client";

import { ArrowRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import lessons from "@/db/lessons";

interface ProgressEntry {
  topic: string;
  subtopics: string[];
}

export interface UserData {
  name: string;
  email: string;
  progressData: ProgressEntry[];
}

const ContinueLearningButton = () => {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic")!;
  const router = useRouter();
  const pathname = usePathname();

  const subtopicSlug =
    searchParams.get("subtopic") ??
    pathname.split("/").filter(Boolean).pop() ??
    "";

  const [data, setData] = useState<UserData | null>(
    getLocalStorageItem<UserData>("userData") || null,
  );

  const handleClick = async () => {
    let updatedData: UserData;

    if (data) {
      updatedData = { ...data };

      const progressData: ProgressEntry[] = updatedData.progressData || [];

      let topicEntry = progressData.find((entry) => entry.topic === topic);

      if (!topicEntry) {
        topicEntry = { topic, subtopics: [] };
        progressData.push(topicEntry);
      }

      if (!topicEntry.subtopics.includes(subtopicSlug)) {
        topicEntry.subtopics.push(subtopicSlug);
      } else {
        console.log("Subtopic already recorded");
      }

      const lesson = lessons.find((item) => item.slug === topic);
      if (lesson && topicEntry.subtopics.length === lesson.topics.length) {
        console.log("Lesson already finished");
      }

      updatedData.progressData = progressData;
    } else {
      updatedData = {
        name: "",
        email: "",
        progressData: [{ topic, subtopics: [subtopicSlug] }],
      };
    }

    setData(updatedData);
    setLocalStorageItem("userData", updatedData);

    router.push(`/lessons/${topic}#`);
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full place-self-end bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
    >
      Continue Learning
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default ContinueLearningButton;
