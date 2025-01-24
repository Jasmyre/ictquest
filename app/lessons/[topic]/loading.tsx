import BackButton from "@/components/BackButton";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Book } from "lucide-react";

export default function loading() {
  return (
    <main>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Loading className="sm:w-[325px] h-[32px]" />
            <br />
            <Loading className="sm:w-[500px] h-[16px]" />
          </div>
        </header>
        <main className="min-h-[65vh]">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Subtopics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[1, 2, 3].map((_, index) => (
                      <li
                        key={index++}
                        className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Loading className="sm:w-[325px] h-[16px]" />
                          </div>
                          <div>
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
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
                <BackButton>Go Back</BackButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
