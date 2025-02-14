"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLocalStorageItem, removeLocalStorageItem } from "@/lib/utils";
import { Award, Book, User } from "lucide-react";
import { useState } from "react";
import { CustomProgress } from "../../components/CustomProgress";
import { UserData } from "@/components/ContinueLearningButton";
import lessons from "@/db/lessons";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  const router = useRouter(); 

  const data = getLocalStorageItem<UserData>("userData");

  if (!data) {
    console.log("Data not found!");
  } else {
    console.log(data);
  }

  const handleReset = () => {
    removeLocalStorageItem("userData");
    router.refresh();
    toast({
      description: "Data has been removed successfully",
    })
  }

  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              Your Profile
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <User className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border-indigo-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                      >
                        Update Profile
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <Book className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lessons.map((lesson) => {
                        const progress = data?.progressData.find(
                          (item) => item.topic === lesson.slug,
                        );

                        const completedSubtopics =
                          progress?.subtopics?.length ?? 0;
                        const totalSubtopics = lesson.topics.length;

                        const percentage =
                          totalSubtopics === 0
                            ? 0
                            : Math.round(
                                (completedSubtopics / totalSubtopics) * 100,
                              );

                        return (
                          <div key={lesson.slug}>
                            <div className="mb-1 flex justify-between">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {lesson.title}
                              </span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {percentage}%
                              </span>
                            </div>
                            <CustomProgress
                              initialValue={0}
                              finalValue={percentage}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <Award className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          HTML Basics Mastery
                        </span>
                      </li>
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Form Builder
                        </span>
                      </li>
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          HTML5 Pioneer
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* <Button
                  className="bg-red-500 text-red-200 hover:bg-red-600"
                  onClick={handleReset}
                >
                  Reset Data
                </Button> */}
                  <AlertDialog>
                    <AlertDialogTrigger className="h-9 rounded bg-red-500 px-4 py-2 text-red-200 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500">
                      Delete Data
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border border-gray-300 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-indigo-600 text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                          onClick={handleReset}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
