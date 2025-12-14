import { ArrowRight, Book } from "lucide-react";
import MagicBackButton from "@/components/custom-ui/magic-back-button";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function loading() {
  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Loading className="h-[34px] sm:w-[325px]" />
            <br />
            <Loading className="h-[16px] sm:w-[500px]" />
          </div>
        </header>
        <main className="min-h-[65vh]">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="font-semibold text-2xl text-gray-900 dark:text-gray-100">
                    Subtopics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[1, 2, 3].map((_, index) => (
                      <li
                        className="border-gray-200 border-b py-4 last:border-b-0 dark:border-gray-700"
                        key={index}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Loading className="h-[16px] sm:w-[325px]" />
                          </div>
                          <div>
                            <Button
                              className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                              disabled
                              size="sm"
                            >
                              Start Lesson
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <div className="mt-6">
                <MagicBackButton
                  className="cursor-pointer"
                  variant={"outline"}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
