"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  {
    value: "light",
    label: "Light",
    description: "Bright theme for well-lit rooms.",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Dim theme for night reading.",
    Icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device setting.",
    Icon: Monitor,
  },
] as const;

/**
 * Appearance panel (spec #81, ticket #83).
 *
 * Local-only theme switch via `next-themes`: the choice applies
 * immediately and persists to this device's `localStorage`. It never
 * touches the server — no procedure, no migration, no sync.
 */
export function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card aria-busy="true" aria-label="Loading appearance settings">
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
          <CardDescription>
            Switch light, dark, or system theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {THEME_OPTIONS.map((option) => (
              <div
                className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 opacity-50"
                key={option.value}
              >
                <div className="h-4 w-4 rounded-full border border-primary" />
                <span className="font-medium text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Appearance</CardTitle>
        <CardDescription>
          Switch light, dark, or system theme. Your choice stays on this device
          only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          aria-label="Theme"
          className="grid gap-2"
          onValueChange={setTheme}
          value={theme}
        >
          {THEME_OPTIONS.map((option) => (
            <Label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors",
                "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-muted/50",
                "motion-reduce:transition-none",
                theme === option.value && "border-primary bg-muted/50"
              )}
              htmlFor={`settings-theme-${option.value}`}
              key={option.value}
            >
              <RadioGroupItem
                id={`settings-theme-${option.value}`}
                value={option.value}
              />
              <option.Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{option.label}</span>
                <span className="block text-muted-foreground text-xs">
                  {option.description}
                </span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
