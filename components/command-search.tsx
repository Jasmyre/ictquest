"use client";

import { Book, Circle, Home, Search, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

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

type ItemType = {
  icon: React.ElementType;
  name: string;
  action: () => string;
};

type ItemsProps = {
  category: string;
  items: ItemType[];
}[];

const items: ItemsProps = [
  {
    category: "Suggestions",
    items: [
      {
        icon: Home,
        name: "Home",
        action: () => "/",
      },
      {
        icon: User,
        name: "Profile",
        action: () => "/profile",
      },
      {
        icon: Book,
        name: "Lessons",
        action: () => "/lessons",
      },
    ],
  },
  {
    category: "Topics",
    items: [
      {
        icon: Circle,
        name: "HTML Basics",
        action: () => "/lessons/html-basics",
      },
      {
        icon: Circle,
        name: "HTML Elements",
        action: () => "/lessons/html-elements",
      },
      {
        icon: Circle,
        name: "HTML Forms",
        action: () => "/lessons/html-forms",
      },
      {
        icon: Circle,
        name: "HTML5 features",
        action: () => "/lessons/html5-features",
      },
    ],
  },
  {
    category: "Others",
    items: [
      {
        icon: Settings,
        name: "Settings",
        action: () => "/settings",
      },
    ],
  },
];

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          <div className="flex w-[225px] justify-between items-center text-gary-600 dark:text-gray-400">
            <div className="flex gap-4">
            Search
            {/* <kbd className="bg-white dark:bg-gray-800 text-gray-400 px-1 border border-gray-500">CRT + K</kbd> */}
            </div>
            <Search className="h-4 w-4" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogTitle>
        <span className="sr-only">Search Command</span>
      </DialogTitle>
      <DialogContent className="p-0 border-none">
        <Command className="rounded-lg border shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CommandInput placeholder="Type a command or search" />
          <CommandList className="">
            <CommandEmpty>No results found.</CommandEmpty>
            {items.map((group) => (
              <CommandGroup key={group.category} heading={group.category}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.name}
                    onSelect={() => runCommand(item.action)}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
