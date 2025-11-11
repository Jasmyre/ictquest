"use client";

import React from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  ChevronRight,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export interface NavItem {
  href?: string;
  name: string;
  icon?: ReactNode;
  children?: NavItem[];
}

interface AdaptiveNavProps {
  navItems: NavItem[];
  pageItems?: NavItem[];
  title?: string;
  enableBlock?: boolean;
}

export function NavigationBar({
  navItems,
  pageItems,
  title = "Logo",
  enableBlock = true,
}: AdaptiveNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const isVisible = useScrollDirection();
  const pathname = usePathname();
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

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{
      name: string;
      href?: string;
      icon?: ReactNode;
    }> = [{ name: "Home", href: "/", icon: <Home className="h-3 w-3" /> }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Capitalize and format segment name
      const name =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

      breadcrumbs.push({
        name,
        href: isLast ? undefined : currentPath,
        icon: undefined,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Search Command Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="absolute top-60 overflow-hidden p-0 shadow-lg lg:top-80">
          <VisuallyHidden>
            <DialogTitle>Search Commands</DialogTitle>
          </VisuallyHidden>
          <Command className="border-none ring-0 outline-none focus:ring-0 focus:outline-none">
            <CommandInput
              placeholder="Type a command or search..."
              className="border-none ring-0 outline-none focus:ring-0 focus:outline-none"
            />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandSeparator />
              <CommandGroup heading="Navigation">
                {navItems.map((item, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      if (item.href) router.push(item.href);
                      setIsSearchOpen(false);
                    }}
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    <span>{item.name}</span>
                    {item.href && <CommandShortcut>Go</CommandShortcut>}
                  </CommandItem>
                ))}
              </CommandGroup>
              {pageItems && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Pages">
                    {pageItems.map((item, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => {
                          if (item.href) router.push(item.href);
                          setIsSearchOpen(false);
                        }}
                        className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        <span>{item.name}</span>
                        {item.href && <CommandShortcut>Go</CommandShortcut>}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem
                  onSelect={() => setIsSearchOpen(false)}
                  className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem
                  onSelect={() => setIsSearchOpen(false)}
                  className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Desktop Navigation */}
      <header
        className={`bg-card dark:border-muted fixed top-0 right-0 left-0 z-50 mx-auto border-b border-gray-300 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } hidden lg:block`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="flex h-14 items-center justify-between px-4">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="cursor-pointer text-xl font-bold opacity-90 transition-all duration-200 hover:opacity-100"
              >
                <span className="flex gap-2">
                  <Image
                    alt="Website logo"
                    src={"/logo.svg"}
                    width={100}
                    height={100}
                    className="h-8 w-8"
                  />
                  {title}
                </span>
              </Link>
              <NavigationMenu className="relative">
                <NavigationMenuList>
                  {navItems.map((item, index) => (
                    <NavigationMenuItem key={index}>
                      {item.children ? (
                        <>
                          <NavigationMenuTrigger className="flex h-10 cursor-pointer items-center gap-2 px-3 py-2 opacity-80 transition-all duration-200 hover:opacity-100">
                            <span className="transition-transform duration-200">
                              {item.icon}
                            </span>
                            {item.name}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="min-w-[400px] p-0">
                            <div className="grid w-[400px] gap-2 p-4">
                              <div className="row-span-3">
                                <NavigationMenuLink asChild>
                                  <Link
                                    className="from-muted/50 to-muted flex h-full w-full cursor-pointer flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline opacity-90 transition-all duration-300 outline-none select-none hover:opacity-100 focus:shadow-md"
                                    href={item.href ?? "#"}
                                  >
                                    <div className="mt-4 mb-2 text-lg font-medium">
                                      {item.name}
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-tight">
                                      Explore all {item.name.toLowerCase()}{" "}
                                      options
                                    </p>
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                              <div className="mt-4 grid gap-1">
                                {item.children.map((child, childIndex) => (
                                  <ListItem
                                    key={childIndex}
                                    href={child.href ?? "#"}
                                    title={child.name}
                                    icon={child.icon}
                                  >
                                    {child.name} description
                                  </ListItem>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href ?? "#"}
                            className={`group ${pathname.includes(item.href ? item.href : "") ? (item.href === pathname ? "border-indigo-500" : "") : "border-transparent"} bg-card hover:bg-muted hover:text-muted-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-10 w-max cursor-pointer items-center justify-center rounded-none border-b px-3 py-2 text-sm font-medium opacity-80 transition-all duration-200 hover:rounded-md hover:opacity-100 focus:rounded-md focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                          >
                            <span className="flex items-center gap-2 transition-transform duration-200">
                              <span className="transition-transform duration-200 group-hover:scale-110">
                                {item.icon}
                              </span>
                              {item.name}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
                <NavigationMenuViewport className="origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]" />
              </NavigationMenu>
            </div>

            {/* Right side - Quick Actions */}
            <div className="flex items-center space-x-1">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="relative cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
              >
                <Search className="h-4 w-4 transition-transform duration-200" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
              >
                {mounted ? (
                  <>
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all duration-300" />
                    ) : (
                      <Moon className="h-4 w-4 scale-100 rotate-0 transition-all duration-300" />
                    )}
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 scale-100 rotate-0 transition-all duration-300" />
                  </>
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="User menu"
                    className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
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
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs - Desktop */}
      {pathname !== "/" && (
        <div
          className={`bg-card fixed ${isVisible ? "top-14" : "top-10"} dark:border-muted right-0 left-0 z-40 border-b border-gray-300 transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-y-0" : "-translate-y-full"
          } hidden lg:block`}
        >
          <div className="container mx-auto max-w-7xl">
            <div className="flex h-10 items-center px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink asChild>
                            <Link
                              href={crumb.href}
                              className="flex cursor-pointer items-center gap-1 opacity-70 transition-all delay-400 duration-200 hover:opacity-100"
                            >
                              <span className="transition-transform duration-200">
                                {crumb.icon}
                              </span>
                              {crumb.name}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="flex items-center gap-1 opacity-100">
                            {crumb.icon}
                            {crumb.name}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <header
        className={`bg-card fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } lg:hidden`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="cursor-pointer text-xl font-bold opacity-90 transition-all duration-200 hover:opacity-100"
          >
            {title}
          </Link>

          {/* Mobile Quick Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
            >
              <Search className="h-4 w-4 transition-transform duration-200" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Mobile Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
            >
              {mounted ? (
                <>
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 scale-100 rotate-0 transition-all duration-300" />
                  ) : (
                    <Moon className="h-4 w-4 scale-100 rotate-0 transition-all duration-300" />
                  )}
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4 scale-100 rotate-0 transition-all duration-300" />
                </>
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle navigation menu"
                  className="cursor-pointer opacity-70 transition-all duration-200 hover:opacity-100"
                >
                  <Menu className="h-6 w-6 transition-transform duration-200" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="max-xs:max-w-full max-xs:w-full w-80 max-w-[75vw] p-0"
              >
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <MobileSidebar
                  navItems={navItems}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                  title={title}
                  pathname={pathname}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Breadcrumbs */}
        {pathname !== "/" && (
          <div className="bg-card border-t border-b border-gray-300 px-4 py-2 dark:border-gray-500">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.length > 3 ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          href="/"
                          className="flex cursor-pointer items-center gap-1 opacity-70 transition-all duration-200 hover:opacity-100"
                        >
                          <Home className="h-3 w-3 transition-transform duration-200" />
                          Home
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="flex items-center gap-1 opacity-100">
                        {breadcrumbs[breadcrumbs.length - 1]?.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink asChild>
                            <Link
                              href={crumb.href}
                              className="flex cursor-pointer items-center gap-1 opacity-70 transition-all duration-200 hover:opacity-100"
                            >
                              <span className="transition-transform duration-200">
                                {crumb.icon}
                              </span>
                              {crumb.name}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="flex items-center gap-1 opacity-100">
                            {crumb.icon}
                            {crumb.name}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      {enableBlock ? (
        <div className={`${pathname !== "/" ? "h-24 lg:h-24" : "h-14"}`} />
      ) : null}
    </>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string; icon?: ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block cursor-pointer space-y-1 rounded-md p-2 leading-none no-underline opacity-80 transition-all duration-200 outline-none select-none hover:opacity-100",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <span className="transition-transform duration-200">{icon}</span>
          <div className="text-sm leading-none font-medium">{title}</div>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";

function MobileSidebar({
  navItems,
  onNavigate,
  title,
  pathname,
}: {
  navItems: NavItem[];
  onNavigate: () => void;
  title: string;
  pathname: string;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="bg-background flex h-full w-full flex-col">
      {/* Sidebar Header */}
      <div className="border-sidebar-border flex flex-col gap-3 border-b p-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex items-center justify-center rounded-sm p-1 transition-all duration-200">
            {/* <User className="h-4 w-4" /> */}
            <Image
              alt="Website logo"
              src={"/logo.svg"}
              width={100}
              height={100}
              className="h-4 w-4"
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
          <div className="text-sidebar-foreground/70 px-2 py-1 text-xs font-semibold tracking-wider uppercase">
            Navigation
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <MobileNavItem
                pathname={pathname}
                key={index}
                item={item}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>

        <Separator className="my-4" />

        {/* Quick Actions in Sidebar */}
        <div className="space-y-1.5">
          <div className="text-sidebar-foreground/70 px-2 py-1 text-xs font-semibold tracking-wider uppercase">
            Quick Actions
          </div>
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="h-9 cursor-pointer justify-start px-3 opacity-80 transition-all duration-200 hover:opacity-100"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {mounted && (
                <>
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4 transition-all duration-300" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4 transition-all duration-300" />
                  )}
                </>
              )}
              Toggle Theme
            </Button>
            <Button
              variant="ghost"
              className="h-9 cursor-pointer justify-start px-3 opacity-80 transition-all duration-200 hover:opacity-100"
              onClick={onNavigate}
              aria-label="Open settings"
            >
              <Settings className="mr-2 h-4 w-4 transition-transform duration-200" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-sidebar-border border-t p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 w-full cursor-pointer justify-start px-3 opacity-90 transition-all duration-200 hover:opacity-100"
              aria-label="User account menu"
            >
              <div className="flex flex-1 items-center gap-2">
                <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all duration-200">
                  JD
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">John Doe</span>
                  <span className="text-sidebar-foreground/70 truncate text-xs">
                    Account
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="relative pl-8">
              <div className="bg-sidebar-border absolute top-0 bottom-0 left-2 w-px"></div>
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onNavigate}
              className="relative cursor-pointer pl-8 opacity-80 transition-all duration-200 hover:opacity-100"
            >
              <div className="bg-sidebar-border absolute top-0 bottom-0 left-2 w-px"></div>
              <User className="mr-2 h-4 w-4 transition-transform duration-200" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onNavigate}
              className="relative cursor-pointer pl-8 opacity-80 transition-all duration-200 hover:opacity-100"
            >
              <div className="bg-sidebar-border absolute top-0 bottom-0 left-2 w-px"></div>
              <Settings className="mr-2 h-4 w-4 transition-transform duration-200" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onNavigate}
              className="relative cursor-pointer pl-8 opacity-80 transition-all duration-200 hover:opacity-100"
            >
              <div className="bg-sidebar-border absolute top-0 bottom-0 left-2 w-px"></div>
              <LogOut className="mr-2 h-4 w-4 transition-transform duration-200" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function MobileNavItem({
  item,
  onNavigate,
  pathname,
}: {
  item: NavItem;
  onNavigate: () => void;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium opacity-80 transition-all duration-200 hover:opacity-100 focus:ring-0 focus:outline-none"
          aria-expanded={isOpen}
          aria-label={`${item.name} menu, ${isOpen ? "expanded" : "collapsed"}`}
        >
          <span className="flex items-center gap-2">
            <span className="transition-transform duration-200">
              {item.icon}
            </span>
            {item.name}
          </span>
          <ChevronRight
            className={`h-4 w-4 transition-all duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
            aria-hidden="true"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-0.5">
          {item.children.map((child, childIndex) => (
            <Link
              key={childIndex}
              href={child.href ?? "#"}
              onClick={onNavigate}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 pl-6 text-sm opacity-70 transition-all duration-200 hover:opacity-100 focus:ring-0 focus:outline-none"
              tabIndex={0}
            >
              <div className="bg-sidebar-border absolute top-0 bottom-0 left-4 w-px"></div>
              <span className="transition-transform duration-200">
                {child.icon}
              </span>
              {child.name}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={item.href ?? "#"}
      onClick={onNavigate}
      className={` ${pathname.includes(item.href ? item.href : "") ? (item.href === pathname ? "bg-primary" : "") : "bg-background"} hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium opacity-80 transition-all duration-200 hover:opacity-100 focus:ring-0 focus:outline-none`}
      tabIndex={0}
    >
      <span className="transition-transform duration-200">{item.icon}</span>
      {item.name}
    </Link>
  );
}
