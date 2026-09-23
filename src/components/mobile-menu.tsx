"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LogOut, Menu, Moon, Settings, Sun, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeaderIcon } from "./header-icon";
import type { HeaderUser } from "./header-user";
import { getInitials } from "./header-user";
import type { HeaderNavItem } from "./site-header";

export type MobileMenuProps = {
  navItems: HeaderNavItem[];
  title: string;
  user: HeaderUser | null;
};

/**
 * Client island: mobile sheet navigation (trigger + sidebar + identity
 * footer). Rendered inside the header's mobile quick-actions row.
 */
export function MobileMenu({ navItems, title, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const close = () => setIsOpen(false);

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Toggle navigation menu"
          className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
          size="icon"
          variant="ghost"
        >
          <Menu className="h-6 w-6 transition-transform duration-200" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-80 max-w-[75vw] p-0 max-xs:w-full max-xs:max-w-full"
        side="right"
      >
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>
        <div className="flex h-full w-full flex-col bg-background">
          {/* Sidebar Header */}
          <div className="flex flex-col gap-3 border-sidebar-border border-b p-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-sm bg-primary p-1 text-primary-foreground transition-all duration-200">
                <Image
                  alt="Website logo"
                  className="h-4 w-4"
                  height={100}
                  src="/logo.svg"
                  width={100}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate px-2 font-semibold">{title}</span>
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto p-3">
            <div className="space-y-1.5">
              <div className="px-2 py-1 font-semibold text-sidebar-foreground/70 text-xs uppercase tracking-wider">
                Navigation
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    className={` ${pathname.includes(item.href) ? (item.href === pathname ? "bg-primary" : "") : "bg-background"} flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 font-medium text-sm opacity-80 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:opacity-100 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground focus:outline-none focus:ring-0`}
                    href={item.href}
                    key={item.href}
                    onClick={close}
                    tabIndex={0}
                  >
                    <span className="transition-transform duration-200">
                      <HeaderIcon name={item.icon} />
                    </span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <Separator className="my-4" />

            {/* Quick Actions in Sidebar */}
            <div className="space-y-1.5">
              <div className="px-2 py-1 font-semibold text-sidebar-foreground/70 text-xs uppercase tracking-wider">
                Quick Actions
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  aria-label="Toggle theme"
                  className="h-9 cursor-pointer justify-start px-3 opacity-80 transition-all duration-200 hover:opacity-100"
                  onClick={toggleTheme}
                  variant="ghost"
                >
                  {mounted ? (
                    theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4 transition-all duration-300" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4 transition-all duration-300" />
                    )
                  ) : null}
                  Toggle Theme
                </Button>
                {user ? (
                  <Button
                    aria-label="Open settings"
                    className="h-9 cursor-pointer justify-start px-3 opacity-80 transition-all duration-200 hover:opacity-100"
                    onClick={close}
                    variant="ghost"
                  >
                    <Settings className="mr-2 h-4 w-4 transition-transform duration-200" />
                    Settings
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="border-sidebar-border border-t p-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="User account menu"
                    className="h-10 w-full cursor-pointer justify-start px-3 opacity-90 transition-all duration-200 hover:opacity-100"
                    variant="ghost"
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground text-xs transition-all duration-200">
                        {user.image ? (
                          <Image
                            alt={user.name ?? "Account"}
                            className="h-6 w-6 object-cover"
                            height={24}
                            src={user.image}
                            width={24}
                          />
                        ) : (
                          getInitials(user.name ?? "Account")
                        )}
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user.name ?? "Account"}
                        </span>
                        <span className="truncate text-sidebar-foreground/70 text-xs">
                          Account
                        </span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56" side="top">
                  <DropdownMenuLabel className="relative pl-8">
                    <div className="absolute top-0 bottom-0 left-2 w-px bg-sidebar-border" />
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="relative cursor-pointer pl-8 opacity-80 transition-all duration-200 hover:opacity-100"
                    onClick={close}
                  >
                    <div className="absolute top-0 bottom-0 left-2 w-px bg-sidebar-border" />
                    <User className="mr-2 h-4 w-4 transition-transform duration-200" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="relative cursor-pointer pl-8 opacity-80 transition-all duration-200 hover:opacity-100"
                    onClick={close}
                  >
                    <div className="absolute top-0 bottom-0 left-2 w-px bg-sidebar-border" />
                    <Settings className="mr-2 h-4 w-4 transition-transform duration-200" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="relative cursor-pointer pl-8 opacity-80 transition-all duration-200 hover:opacity-100"
                    onClick={close}
                  >
                    <div className="absolute top-0 bottom-0 left-2 w-px bg-sidebar-border" />
                    <LogOut className="mr-2 h-4 w-4 transition-transform duration-200" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth" onClick={close}>
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
