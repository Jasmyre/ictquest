import { Book } from "lucide-react";
import { CustomProgress } from "@/components/custom-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LearningProgressCardLoading = () => (
  <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <CardHeader>
      <CardTitle className="flex flex-wrap items-center justify-between gap-4 font-semibold text-2xl text-gray-900 dark:text-gray-100">
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
            <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
              0%
            </span>
          </div>
          <CustomProgress finalValue={0} initialValue={0} />
        </div>

        <div>
          <div className="mb-1 flex justify-end">
            <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
              0%
            </span>
          </div>
          <CustomProgress finalValue={0} initialValue={0} />
        </div>

        <div>
          <div className="mb-1 flex justify-end">
            <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
              0%
            </span>
          </div>
          <CustomProgress finalValue={0} initialValue={0} />
        </div>

        <div>
          <div className="mb-1 flex justify-end">
            <span className="font-medium text-gray-700 text-sm dark:text-gray-300">
              0%
            </span>
          </div>
          <CustomProgress finalValue={0} initialValue={0} />
        </div>

        <div className="mt-4">
          <Button
            className="border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            disabled
          >
            View All
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
