import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "../lib/utils";

const LessonCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
        className,
      )}
    >
      <CardHeader></CardHeader>
      <CardContent className="min-h-[65vh] text-gray-900 dark:text-gray-200">
        {children}
      </CardContent>
    </Card>
  );
};

export default LessonCard;
