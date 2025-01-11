import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

const LessonCard = ({ children }: { children: ReactNode }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader></CardHeader>
      <CardContent className="min-h-[65vh] text-gray-900 dark:text-gray-200">{children}</CardContent>
    </Card>
  );
};

export default LessonCard;
