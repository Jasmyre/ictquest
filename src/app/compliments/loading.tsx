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
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    <Loading className="sm:w-[600px] h-[32px]" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center">
                    <Loading className="w-[500px] h-[400px]" />
                  </div>
                  <div className="space-y-6">
                    <span>
                      <br />
                      <Loading className="sm:w-[250px] h-[16px]" />
                      <br />
                      <Loading className="sm:w-[80%] h-[16px]" />
                      <br />
                    </span>
                    <span>
                      <Loading className="sm:w-[325px] h-[16px]" />
                      <br />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
