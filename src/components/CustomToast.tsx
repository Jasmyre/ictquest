import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const CustomToast = ({
  description,
  className,
  ...props
}: {
  description?: string;
  className?: string;
}) => {
  useEffect(() => {
    toast({
      description,
      className: cn(
        "order border-gray-400 text-gray-500 dark:border-gray-700 dark:text-gray-200",
        className
      ),
      ...props,
    });
  });

  return <div />;
};
