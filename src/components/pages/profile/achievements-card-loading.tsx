import { Award } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const AchievementsCardLoading = () => (
  <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <CardHeader>
      <CardTitle className="flex items-center font-semibold text-2xl text-gray-900 dark:text-gray-100">
        <Award className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        Achievements
      </CardTitle>
    </CardHeader>
  </Card>
);
