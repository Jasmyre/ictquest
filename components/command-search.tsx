"use client";

import { Book, Circle, Home, Search, Settings, User } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";

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
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Link from "next/link";

type ItemType = {
  icon: React.ElementType;
  name: string;
  href: string;
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
        href: "/",
        action: () => "/",
      },
      {
        icon: User,
        name: "Profile",
        href: "/profile",
        action: () => "/profile",
      },
      {
        icon: Book,
        name: "Lessons",
        href: "/lessons",
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
        href: "/lessons/html-basics",
        action: () => "/lessons/html-basics",
      },
      {
        icon: Circle,
        name: "HTML Elements",
        href: "/lessons/html-elements",
        action: () => "/lessons/html-elements",
      },
      {
        icon: Circle,
        name: "HTML Forms",
        href: "/lessons/html-forms",
        action: () => "/lessons/html-forms",
      },
      {
        icon: Circle,
        name: "HTML5 features",
        href: "/lessons/html5-features",
        action: () => "/lessons/html5-features",
      },
    ],
  },
  {
    category: "Settings",
    items: [
      {
        icon: Settings,
        name: "Settings",
        href: "/settings",
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
      setOpen(false);
      const path = command();
      router.push(path);
    },
    [router],
  );

  const renderItem = (item: ItemType) => {
    return (
      <CommandItem
        key={item.name}
        onSelect={() => runCommand(item.action)}
        className="hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <item.icon className="mr-2 h-4 w-4" />
        <span>{item.name}</span>
      </CommandItem>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-sm bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <div className="flex w-[150px] justify-between items-center">
            Search...
            <Search className="h-4 w-4" />
          </div>
          {/* <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd> */}
        </Button>
      </DialogTrigger>
      <DialogTitle>
        <span className="sr-only">Search Command</span>
      </DialogTitle>
      <DialogContent className="p-0 border-none">
        <Command className="rounded-lg border shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <CommandInput placeholder="Type a command or search" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {items.map((group) => (
              <CommandGroup key={group.category} heading={group.category}>
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    passHref
                    legacyBehavior
                  >
                    {renderItem(item)}
                  </Link>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
