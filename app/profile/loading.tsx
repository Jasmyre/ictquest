import { CustomProgress } from "@/components/CustomProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Book, User } from "lucide-react";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function LoadingProfile() {
  return (
    <main>
      <div className="py-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Your Profile
          </h1>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex min-w-min flex-wrap gap-2">
                    <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <p>Personal Information</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </Label>
                    <Input
                      disabled
                      className="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                      disabled
                      className="cursor-pointer border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <Button
                    className="border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    disabled
                  >
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  <div className="flex items-center">
                    <Book className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    Learning Progress
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-end">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        0%
                      </span>
                    </div>
                    <CustomProgress initialValue={0} finalValue={0} />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-end">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        0%
                      </span>
                    </div>
                    <CustomProgress initialValue={0} finalValue={0} />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-end">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        0%
                      </span>
                    </div>
                    <CustomProgress initialValue={0} finalValue={0} />
                  </div>

                  <div className="mt-4">
                    <Button
                      disabled
                      className="border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      View All
                    </Button>
                  </div>
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

            <AlertDialog>
              <AlertDialogTrigger
                disabled
                className="h-9 rounded bg-gray-200 px-4 py-2 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
              >
                Delete Data
              </AlertDialogTrigger>
            </AlertDialog>

            {/* <LearningProgressCard key={refreshKey} /> */}
            {/* <AchievementsCard /> */}
            {/* <DeleteDataCard onResetAction={handleRefresh} /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
