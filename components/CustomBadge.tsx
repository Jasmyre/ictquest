import React, { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export type CustomBadgeColorProps = "red" | "orange" | "green" | "indigo";

export const CustomBadge = ({
  children,
  className,
  color,
  ...props
}: {
  children: ReactNode;
  className?: string;
  color?: CustomBadgeColorProps;
}) => {
  return (
    <Badge
      className={cn(
        `${color === "red" ? "bg-red-500 text-red-200 hover:bg-red-600" : null} ${color === "orange" ? "bg-orange-500 text-orange-200 hover:bg-orange-600" : null} ${color === "green" ? "bg-green-500 text-green-200 hover:bg-green-600" : null} ${color === "indigo" || !color} px-4 py-1`,
        className,
      )}
      {...props}
    >
      {children}
    </Badge>
  );
};
