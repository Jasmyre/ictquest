"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Route error card (#94).
 *
 * Catches load failures from the by-id read (a missing id is routed to the
 * not-found boundary instead) and offers a real retry through `reset`, per
 * the design-system §6 error/unavailable pattern.
 */
export default function UserProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Card className="mt-6" role="alert">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-sm">
              Unable to load this profile right now.
            </p>
            <p className="mt-1 text-muted-foreground text-sm">
              Something went wrong on our side. Try again in a moment.
            </p>
          </div>
          <Button
            className="w-full transition-transform duration-150 ease-out active:scale-[0.97] sm:w-fit"
            onClick={() => reset()}
            type="button"
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
