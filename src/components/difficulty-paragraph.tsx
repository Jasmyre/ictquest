import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CustomBadgeColorProps } from "./custom-badge";
import { CustomBadge } from "./custom-badge";

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
}) => (
  <div
    className={cn("flex justify-between max-sm:flex-col-reverse", className)}
    {...props}
  >
    <span className="min-w-min">{children}</span>
    <br />
    <CustomBadge
      className="flex h-min w-max justify-center self-center max-sm:w-full"
      color={color}
    >
      {difficulty}
    </CustomBadge>
  </div>
);
