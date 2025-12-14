"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { usePageTrackerStore } from "react-page-tracker";
import { getCurrentHostname, getCurrentOrigin, navigateTo } from "@/lib/env";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type MagicBackButtonProps = {
  backLink?: string;
  fallbackPath?: string;
  className?: string;
  ariaLabel?: string;
  asChild?: boolean;
  children?: React.ReactNode;
} & VariantProps<typeof buttonVariants>;

export function MagicBackButton({
  backLink,
  fallbackPath,
  className,
  ariaLabel = "Go back",
  asChild = false,
  children,
  variant,
  size,
}: MagicBackButtonProps) {
  const router = useRouter();

  const trackerStore = usePageTrackerStore((s) => s);
  const referrerFromTracker: string = trackerStore?.referrer ?? "";

  const hostnameFromUrl = (url?: string) => {
    try {
      if (!url) {
        return "";
      }
      // use getCurrentOrigin() so tests (and server) behave the same way
      return new URL(url, getCurrentOrigin() || undefined).hostname;
    } catch {
      return "";
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: hostnameFromUrl changes on every re-render and should not be used as a hook dependency.
  const handleClick = useCallback(() => {
    // 1) explicit backlink -> go there
    if (backLink) {
      try {
        const candidate = new URL(backLink, getCurrentOrigin());
        if (candidate.origin === getCurrentOrigin()) {
          router.push(candidate.pathname + candidate.search + candidate.hash);
        } else {
          // use navigateTo helper instead of direct window.location.assign
          navigateTo(candidate.toString());
        }
      } catch {
        router.push(backLink);
      }
      return;
    }

    // 2) determine previous url from multiple sources
    const refFromTracker = referrerFromTracker;
    const refFromDocument =
      typeof document !== "undefined" ? document.referrer : "";
    const refFromSession =
      typeof sessionStorage !== "undefined"
        ? (sessionStorage.getItem("prevPath") ?? "")
        : "";

    const lastUrl = refFromTracker || refFromDocument || refFromSession || "";
    const lastHostname = hostnameFromUrl(lastUrl);
    const currentHostname = getCurrentHostname();

    if (lastHostname && lastHostname === currentHostname) {
      router.back();
      return;
    }

    // Otherwise redirect to fallback (default '/')
    const fallback = fallbackPath ?? "/";
    try {
      // USE getCurrentOrigin() as base here too
      const maybeUrl = new URL(fallback, getCurrentOrigin());
      if (maybeUrl.origin === getCurrentOrigin()) {
        router.push(maybeUrl.pathname + maybeUrl.search + maybeUrl.hash);
      } else {
        // use navigateTo here too
        navigateTo(maybeUrl.toString());
      }
    } catch {
      router.push(fallback);
    }
  }, [backLink, fallbackPath, referrerFromTracker, router]);

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      aria-label={ariaLabel}
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      onClick={handleClick}
      {...(Comp === "button" && { type: "button" })}
    >
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height="18"
        viewBox="0 0 24 24"
        width="18"
      >
        <path
          d="M15 6L9 12l6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span className="hidden sm:inline">{children ?? "Back"}</span>
    </Comp>
  );
}

export default MagicBackButton;
