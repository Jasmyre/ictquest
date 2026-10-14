"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function AppearanceSettingsCard() {
  const { theme, setTheme } = useTheme();
  // next-themes resolves the stored theme only on the client, so the selected
  // item would differ from the SSR markup. Render a same-size placeholder
  // until mount, then swap — hydration output stays identical.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Appearance</CardTitle>
        <CardDescription>
          Reading comfort for this device. Never leaves your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {mounted ? (
          <ToggleGroup
            aria-label="Color theme"
            className="justify-start"
            onValueChange={(value) => {
              if (value) {
                setTheme(value);
              }
            }}
            spacing={2}
            type="single"
            value={theme ?? "system"}
            variant="outline"
          >
            <ToggleGroupItem
              aria-label="Light theme"
              className="cursor-pointer gap-2 px-4"
              value="light"
            >
              <Sun data-icon="inline-start" />
              Light
            </ToggleGroupItem>
            <ToggleGroupItem
              aria-label="Dark theme"
              className="cursor-pointer gap-2 px-4"
              value="dark"
            >
              <Moon data-icon="inline-start" />
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem
              aria-label="System theme"
              className="cursor-pointer gap-2 px-4"
              value="system"
            >
              <Laptop data-icon="inline-start" />
              System
            </ToggleGroupItem>
          </ToggleGroup>
        ) : (
          <div aria-hidden="true" className="flex w-fit items-center gap-2">
            <div className="h-9 w-24 rounded-md bg-muted motion-safe:animate-pulse" />
            <div className="h-9 w-24 rounded-md bg-muted motion-safe:animate-pulse" />
            <div className="h-9 w-24 rounded-md bg-muted motion-safe:animate-pulse" />
          </div>
        )}
        <Alert>
          <AlertTitle>Local-only</AlertTitle>
          <AlertDescription>
            Your theme stays on this device and never syncs to the server —
            switch devices and pick again.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
