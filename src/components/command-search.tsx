"use client";

import * as React from "react";
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

import lessons from "@/db/lessons";

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

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JSX } from "react";

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
    [router],
  );

  const lessonGroups = React.useMemo<ItemsGroup[]>(() => {
    return lessons
      .filter((lesson) => lesson.topics && lesson.topics.length > 0)
      .map((lesson) => ({
        category: lesson.title,
        items: lesson.topics.map((topic) => ({
          icon: Circle,
          name: topic.name,
          action: () => `/lessons/subtopic/${topic.slug}?topic=${lesson.slug}`,
        })),
      }));
  }, []);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between border-gray-300 bg-gray-50 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-900",
            className,
          )}
          tabIndex={-1}
        >
          <div className="flex min-w-min items-center justify-between gap-4 max-md:w-[150px] max-sm:w-full md:w-[150px] dark:text-gray-400">
            <div className="flex gap-4">Search</div>
            <Search className="h-4 w-4" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogTitle>
        <span className="sr-only">Search Command</span>
      </DialogTitle>
      <DialogContent
        className="border-none p-0 max-sm:top-[225px]"
        aria-describedby="Search box dialog content"
      >
        <Command className="rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
          <CommandInput placeholder="Type a command or search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {commandGroups.map((group) => (
              <CommandGroup key={group.category} heading={group.category}>
                {group.items.map((item) => {
                  const route = item.action();
                  return (
                    <CommandItem
                      key={`${item.name}-${route}`}
                      onSelect={() => runCommand(item.action)}
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
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
