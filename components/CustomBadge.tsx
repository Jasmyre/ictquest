import React, { ReactNode } from 'react'
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"

export const CustomBadge = ({children, className, color, ...props}: {children: ReactNode, className?: string, color?: "red" | "yellow" | "green" | "indigo"}) => {
  return (
    <Badge className={cn(`${color === "red" ? "bg-red-500 text-red-200" : null} ${color === "yellow" ? "bg-yellow-500 text-yellow-200" : null} ${color === "green"? "bg-green-500 text-green-200" : null} ${color === "indigo" || !color}`, className)} {...props}>{children}</Badge>
  )
}
