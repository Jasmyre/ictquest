"use client";

import {
  Book,
  Circle,
  Eye,
  FileText,
  Globe,
  Home,
  Search,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { JSX } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import lessons from "@/db/lessons";
import { cn } from "@/lib/utils";

type ItemType = {
  icon: React.ElementType;
  name: string;
  action: () => string;
};

type ItemsGroup = {
  category: string;
  items: ItemType[];
};

export function CommandSearch({
  className,
}: Readonly<{ className?: string }>): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent): void => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback(
    (command: () => string) => {
      const path = command();
      router.push(path);
      setOpen(false);
    },
    [router]
  );

  const lessonGroups = React.useMemo<ItemsGroup[]>(
    () =>
      lessons
        .filter((lesson) => lesson.topics && lesson.topics.length > 0)
        .map((lesson) => ({
          category: lesson.title,
          items: lesson.topics.map((topic) => ({
            icon: Circle,
            name: topic.name,
            action: () =>
              `/lessons/subtopic/${topic.slug}?topic=${lesson.slug}`,
          })),
        })),
    []
  );

  const commandGroups: ItemsGroup[] = [
    {
      category: "Suggestions",
      items: [
        { icon: Home, name: "Home", action: () => "/" },
        { icon: User, name: "Profile", action: () => "/profile" },
        { icon: Book, name: "Lessons", action: () => "/lessons" },
        { icon: Globe, name: "People", action: () => "/social/new" },
      ],
    },
    ...lessonGroups,
    {
      category: "Others",
      items: [
        { icon: Settings, name: "Settings", action: () => "/settings" },
        { icon: FileText, name: "Terms of use", action: () => "/terms" },
        { icon: Shield, name: "Privacy policy", action: () => "/privacy" },
        { icon: Eye, name: "Access roles", action: () => "/access" },
      ],
    },
  ];

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "w-full justify-between border-gray-300 bg-gray-50 text-gray-700 text-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-900",
            className
          )}
          tabIndex={-1}
          variant="outline"
        >
          <div className="flex min-w-min items-center justify-between gap-4 max-sm:w-full max-md:w-[150px] md:w-[150px] dark:text-gray-400">
            <div className="flex gap-4">Search</div>
            <Search className="h-4 w-4" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogTitle>
        <span className="sr-only">Search Command</span>
      </DialogTitle>
      <DialogContent
        aria-describedby="Search box dialog content"
        className="border-none p-0 max-sm:top-[225px]"
      >
        <Command className="rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
          <CommandInput placeholder="Type a command or search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {commandGroups.map((group) => (
              <CommandGroup heading={group.category} key={group.category}>
                {group.items.map((item) => {
                  const route = item.action();
                  return (
                    <CommandItem
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                      key={`${item.name}-${route}`}
                      onSelect={() => runCommand(item.action)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
