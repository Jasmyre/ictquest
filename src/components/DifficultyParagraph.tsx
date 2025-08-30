import React, { ReactNode } from "react";
import { CustomBadge, CustomBadgeColorProps } from "./CustomBadge";
import { cn } from "@/lib/utils";

export const DifficultyParagraph = ({
  children,
  difficulty,
  color,
  className,
  ...props
}: {
  children: ReactNode;
  difficulty?: string;
  color?: CustomBadgeColorProps;
  className?: string;
}) => {
  return (
    <div
      className={cn("flex justify-between max-sm:flex-col-reverse", className)}
      {...props}
    >
      <span className="min-w-min">{children}</span>
      <br />
      <CustomBadge
        color={color}
        className="flex h-min w-max justify-center self-center max-sm:w-full"
      >
        {difficulty}
      </CustomBadge>
    </div>
  );
};
