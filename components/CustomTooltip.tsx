import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import React, { ReactNode } from 'react'

export const CustomTooltip = ({children, content}: {children: ReactNode; content: () => ReactNode}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          {content()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
