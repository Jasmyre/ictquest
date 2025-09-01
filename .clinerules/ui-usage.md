# UI Component Guidelines

This document outlines UI component guidelines for the project.

## Component Props

- Use consistent prop names:
  - `variant`: For visual style variations (e.g., "primary", "secondary", "outline")
  - `size`: For size variations (e.g., "sm", "md", "lg")
  - `disabled`: To disable interactions
- Always include `className` prop for customization
- Use TypeScript interfaces to define component props

## Component Structure

```tsx
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  // ...other props
}

export const Button = ({ 
  variant = "primary", 
  size = "md", 
  disabled = false,
  className,
  ...props 
}: ButtonProps) => (
  <button 
    className={cn(
      baseButtonStyles,
      buttonVariants({ variant, size }),
      className
    )}
    disabled={disabled}
    {...props}
  />
);
```

## Best Practices

- Always pass through any unhandled props to the underlying element
- Use the `cn` utility for class name composition
- Provide sensible default values for variant and size props
- Use tailwind-merge patterns for consistent styling
