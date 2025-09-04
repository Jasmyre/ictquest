"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type JSX } from "react";

export function ThemeProvider({
  children,
  ...props
}: Readonly<React.ComponentProps<typeof NextThemesProvider>>): JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
