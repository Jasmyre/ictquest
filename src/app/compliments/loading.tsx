import ContinueLearningButton from "@/components/ContinueLearningButton";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Code, Zap } from "lucide-react";

const achievements = [
  {
    name: "HTML Novice",
    description: "Completed your first HTML lesson",
    icon: BookOpen,
  },
  {
    name: "Tag Master",
    description: "Successfully used multiple HTML tags",
    icon: Code,
  },
  {
    name: "Quick Learner",
    description: "Finished a lesson in record time",
    icon: Zap,
  },
  {
    name: "Perfect Score",
    description: "Answered all questions correctly",
    icon: Award,
  },
];

const loading = () => {
  return (
    <main>
      <div className="py-10">
        {/* <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Loading className="sm:w-[325px] h-[44px]" />
          </div>
        </header> */}
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    <Loading className="h-[32px] sm:w-[600px]" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <Loading className="h-[400px] w-[500px]" />
                  </div>
                  <div className="space-y-6">
                    <span>
                      <br />
                      <Loading className="h-[16px] sm:w-[250px]" />
                      <br />
                      <Loading className="h-[16px] sm:w-[80%]" />
                      <br />
                    </span>
                    <span>
                      <Loading className="h-[16px] sm:w-[325px]" />
                      <br />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {achievements.map((_, index) => (
                          <Loading key={index++} className="h-[104px]" />
                        ))}
                      </div>
                    </span>
                    <br />
                  </div>
                  <span className="mt-8">
                    <ContinueLearningButton />
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
};

export default loading;
