import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import React, { ReactNode } from "react";

export const CustomTooltip = ({
  children,
  content,
  className,
}: {
  children: ReactNode;
  content: () => ReactNode;
  className?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>{children}</TooltipTrigger>
        <TooltipContent className="bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          {content()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
