import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const CustomTooltip = ({
  children,
  content,
  className,
}: {
  children: ReactNode;
  content: () => ReactNode;
  className?: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        className={cn("flex items-center justify-start", className)}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
        {content()}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
