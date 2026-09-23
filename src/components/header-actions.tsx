"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LogOut, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HeaderIcon } from "./header-icon";
import { DESKTOP_ACTIONS, MOBILE_ACTIONS } from "./header-tokens";
import type { HeaderUser } from "./header-user";
import { MobileMenu } from "./mobile-menu";
import type { HeaderNavItem } from "./site-header";

export type HeaderActionsProps = {
  navItems: HeaderNavItem[];
  pageItems: HeaderNavItem[];
  showSearch: boolean;
  title: string;
  user: HeaderUser | null;
};

/**
 * Client island: everything interactive on the right side of the header —
 * search palette (⌘K), theme toggle, and the user menu / Sign in.
 * Renders the desktop row (`lg:flex`) and the mobile quick-actions row
 * (`lg:hidden`, incl. the `MobileMenu` trigger) from one state so the
 * palette and its shortcut stay singular.
 */
export function HeaderActions({
  navItems,
  pageItems,
  showSearch,
  title,
  user,
}: HeaderActionsProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Ensure theme is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const themeIcon = mounted ? (
    theme === "dark" ? (
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300" />
    ) : (
      <Moon className="h-4 w-4 rotate-0 scale-100 transition-all duration-300" />
    )
  ) : (
    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300" />
  );

  return (
    <>
      {/* Search Command Dialog */}
      <Dialog onOpenChange={setIsSearchOpen} open={isSearchOpen}>
        <DialogContent className="absolute top-60 overflow-hidden p-0 shadow-lg lg:top-80">
          <VisuallyHidden>
            <DialogTitle>Search Commands</DialogTitle>
          </VisuallyHidden>
          <Command className="border-none outline-none ring-0 focus:outline-none focus:ring-0">
            <CommandInput
              className="border-none outline-none ring-0 focus:outline-none focus:ring-0"
              placeholder="Type a command or search..."
            />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandSeparator />
              <CommandGroup heading="Navigation">
                {navItems.map((item) => (
                  <CommandItem
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                    key={item.href}
                    onSelect={() => {
                      router.push(item.href);
                      setIsSearchOpen(false);
                    }}
                  >
                    <span className="mr-2">
                      <HeaderIcon name={item.icon} />
                    </span>
                    <span>{item.name}</span>
                    <CommandShortcut>Go</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
              {pageItems.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Pages">
                    {pageItems.map((item) => (
                      <CommandItem
                        className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                        key={item.href}
                        onSelect={() => {
                          router.push(item.href);
                          setIsSearchOpen(false);
                        }}
                      >
                        <span className="mr-2">
                          <HeaderIcon name={item.icon} />
                        </span>
                        <span>{item.name}</span>
                        <CommandShortcut>Go</CommandShortcut>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
              <CommandSeparator />
              {user ? (
                <CommandGroup heading="Settings">
                  <CommandItem
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                    onSelect={() => {
                      router.push("/profile");
                      setIsSearchOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                  <CommandItem
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                    onSelect={() => {
                      router.push("/settings");
                      setIsSearchOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <CommandShortcut>⌘S</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Desktop quick actions */}
      <div className={DESKTOP_ACTIONS}>
        {showSearch ? (
          <Button
            aria-label="Search"
            className="relative cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
            onClick={() => setIsSearchOpen(true)}
            size="icon"
            variant="ghost"
          >
            <Search className="h-4 w-4 transition-transform duration-200" />
            <span className="sr-only">Search</span>
          </Button>
        ) : null}
        <Button
          aria-label="Toggle theme"
          className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
        >
          {themeIcon}
          <span className="sr-only">Toggle theme</span>
        </Button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="User menu"
                className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                size="icon"
                variant="ghost"
              >
                <User className="h-4 w-4 transition-transform duration-200" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer opacity-80 transition-all duration-200 hover:opacity-100">
                <User className="mr-2 h-4 w-4 transition-transform duration-200" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer opacity-80 transition-all duration-200 hover:opacity-100">
                <Settings className="mr-2 h-4 w-4 transition-transform duration-200" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer opacity-80 transition-all duration-200 hover:opacity-100">
                <LogOut className="mr-2 h-4 w-4 transition-transform duration-200" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="outline">
            <Link href="/auth">Sign in</Link>
          </Button>
        )}
      </div>

      {/* Mobile quick actions */}
      <div className={MOBILE_ACTIONS}>
        {showSearch ? (
          <Button
            aria-label="Search"
            className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
            onClick={() => setIsSearchOpen(true)}
            size="icon"
            variant="ghost"
          >
            <Search className="h-4 w-4 transition-transform duration-200" />
            <span className="sr-only">Search</span>
          </Button>
        ) : null}
        <Button
          aria-label="Toggle theme"
          className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
        >
          {themeIcon}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <MobileMenu navItems={navItems} title={title} user={user} />
      </div>
    </>
  );
}
