"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type {
  ComponentProps,
  HTMLAttributes,
  MouseEventHandler,
  ReactElement,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const DropDrawerContext = createContext<{ isMobile: boolean }>({
  isMobile: false,
});

const useDropDrawerContext = () => {
  const context = useContext(DropDrawerContext);
  if (!context) {
    throw new Error(
      "DropDrawer components cannot be rendered outside the DropDrawer Context"
    );
  }
  return context;
};

const GroupContext = createContext(false);

function DropDrawer({
  children,
  ...props
}: ComponentProps<typeof Drawer> | ComponentProps<typeof DropdownMenu>) {
  const isMobile = useIsMobile();
  const DropdownComponent = isMobile ? Drawer : DropdownMenu;

  return (
    <DropDrawerContext.Provider value={{ isMobile }}>
      <DropdownComponent data-slot="drop-drawer" {...props}>
        {children}
      </DropdownComponent>
    </DropDrawerContext.Provider>
  );
}

function DropDrawerTrigger({
  className,
  children,
  ...props
}:
  | ComponentProps<typeof DrawerTrigger>
  | ComponentProps<typeof DropdownMenuTrigger>) {
  const { isMobile } = useDropDrawerContext();
  const TriggerComponent = isMobile ? DrawerTrigger : DropdownMenuTrigger;

  return (
    <TriggerComponent
      className={className}
      data-slot="drop-drawer-trigger"
      {...props}
    >
      {children}
    </TriggerComponent>
  );
}

type SubmenuContextType = {
  activeSubmenu: string | null;
  setActiveSubmenu: (id: string | null) => void;
  submenuTitle: string | null;
  setSubmenuTitle: (title: string | null) => void;
  navigateToSubmenu?: (id: string, title: string) => void;
  registerSubmenuContent?: (id: string, content: ReactNode[]) => void;
};

function noopDefault() {
  /* default context no-op */
}

const SubmenuContext = createContext<SubmenuContextType>({
  activeSubmenu: null,
  setActiveSubmenu: noopDefault,
  submenuTitle: null,
  setSubmenuTitle: noopDefault,
  navigateToSubmenu: undefined,
  registerSubmenuContent: undefined,
});

function MobilePanel({
  panelKey,
  direction,
  children,
}: {
  panelKey: string;
  direction: "forward" | "backward";
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      animate="center"
      className="w-full space-y-1.5 pb-6"
      custom={direction}
      exit="exit"
      initial="enter"
      key={panelKey}
      transition={{ duration: 0.25, ease: [...EASE_OUT] }}
      variants={{
        enter: (dir: "forward" | "backward") =>
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                transform: `translateX(${dir === "forward" ? "24px" : "-24px"}) scale(0.98)`,
              },
        center: { opacity: 1, transform: "translateX(0px) scale(1)" },
        exit: (dir: "forward" | "backward") =>
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                transform: `translateX(${dir === "forward" ? "-24px" : "24px"}) scale(0.98)`,
              },
      }}
    >
      {children}
    </motion.div>
  );
}

function DropDrawerContent({
  className,
  children,
  ...props
}:
  | ComponentProps<typeof DrawerContent>
  | ComponentProps<typeof DropdownMenuContent>) {
  const { isMobile } = useDropDrawerContext();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuTitle, setSubmenuTitle] = useState<string | null>(null);
  const [, setSubmenuStack] = useState<{ id: string; title: string }[]>([]);
  const [animationDirection, setAnimationDirection] = useState<
    "forward" | "backward"
  >("forward");

  const submenuContentRef = useRef<Map<string, ReactNode[]>>(new Map());

  const navigateToSubmenu = useCallback((id: string, title: string) => {
    setAnimationDirection("forward");
    setActiveSubmenu(id);
    setSubmenuTitle(title);
    setSubmenuStack((prev) => [...prev, { id, title }]);
  }, []);

  const goBack = useCallback(() => {
    setAnimationDirection("backward");
    setSubmenuStack((prev) => {
      if (prev.length <= 1) {
        setActiveSubmenu(null);
        setSubmenuTitle(null);
        return [];
      }
      const next = prev.slice(0, -1);
      const previous = next.at(-1);
      if (!previous) {
        setActiveSubmenu(null);
        setSubmenuTitle(null);
        return [];
      }
      setActiveSubmenu(previous.id);
      setSubmenuTitle(previous.title);
      return next;
    });
  }, []);

  const registerSubmenuContent = useCallback(
    (id: string, content: ReactNode[]) => {
      submenuContentRef.current.set(id, content);
    },
    []
  );

  const extractSubmenuContent = useCallback(
    (elements: ReactNode, targetId: string): ReactNode[] => {
      const result: ReactNode[] = [];
      const findSubmenuContent = (node: ReactNode) => {
        if (!isValidElement(node)) {
          return;
        }
        const element = node as ReactElement;
        const elementProps = element.props as {
          id?: string;
          "data-submenu-id"?: string;
          children?: ReactNode;
        };
        if (element.type === DropDrawerSub) {
          const elementId = elementProps.id;
          const dataSubmenuId = elementProps["data-submenu-id"];
          if (elementId === targetId || dataSubmenuId === targetId) {
            if (elementProps.children) {
              Children.forEach(elementProps.children, (child) => {
                if (
                  isValidElement(child) &&
                  child.type === DropDrawerSubContent
                ) {
                  const subContentProps = child.props as {
                    children?: ReactNode;
                  };
                  if (subContentProps.children) {
                    Children.forEach(
                      subContentProps.children,
                      (contentChild) => {
                        result.push(contentChild);
                      }
                    );
                  }
                }
              });
            }
            return;
          }
        }
        if (elementProps.children) {
          Children.forEach(elementProps.children, (child) =>
            findSubmenuContent(child)
          );
        }
      };
      Children.forEach(elements, (child) => findSubmenuContent(child));
      return result;
    },
    []
  );

  const getSubmenuContent = useCallback(
    (id: string) => {
      const cached = submenuContentRef.current.get(id);
      if (cached && cached.length > 0) {
        return cached;
      }
      const content = extractSubmenuContent(children, id);
      if (id && content.length > 0) {
        submenuContentRef.current.set(id, content);
      }
      return content;
    },
    [children, extractSubmenuContent]
  );

  if (isMobile) {
    return (
      <SubmenuContext.Provider
        value={{
          activeSubmenu,
          setActiveSubmenu: (id) => {
            if (id === null) {
              setActiveSubmenu(null);
              setSubmenuTitle(null);
              setSubmenuStack([]);
            }
          },
          submenuTitle,
          setSubmenuTitle,
          navigateToSubmenu,
          registerSubmenuContent,
        }}
      >
        <DrawerContent
          className={cn("max-h-[90vh]", className)}
          data-slot="drop-drawer-content"
          {...props}
        >
          {activeSubmenu ? (
            <>
              <DrawerHeader>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Back to menu"
                    className="rounded-full p-1 transition-transform duration-150 ease-out hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]"
                    onClick={goBack}
                    type="button"
                  >
                    <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <DrawerTitle>{submenuTitle || "Submenu"}</DrawerTitle>
                </div>
              </DrawerHeader>
              <div className="relative max-h-[70vh] flex-1 overflow-y-auto overflow-x-hidden">
                <AnimatePresence
                  custom={animationDirection}
                  initial={false}
                  mode="popLayout"
                >
                  <MobilePanel
                    direction={animationDirection}
                    key={activeSubmenu}
                    panelKey={activeSubmenu}
                  >
                    {getSubmenuContent(activeSubmenu)}
                  </MobilePanel>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <DrawerHeader className="sr-only">
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
                <AnimatePresence
                  custom={animationDirection}
                  initial={false}
                  mode="popLayout"
                >
                  <MobilePanel
                    direction={animationDirection}
                    key="main-menu"
                    panelKey="main-menu"
                  >
                    {children}
                  </MobilePanel>
                </AnimatePresence>
              </div>
            </>
          )}
        </DrawerContent>
      </SubmenuContext.Provider>
    );
  }

  return (
    <SubmenuContext.Provider
      value={{
        activeSubmenu,
        setActiveSubmenu,
        submenuTitle,
        setSubmenuTitle,
        registerSubmenuContent,
      }}
    >
      <DropdownMenuContent
        align="end"
        className={cn(
          "max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[220px] origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-y-auto",
          className
        )}
        data-slot="drop-drawer-content"
        sideOffset={4}
        {...props}
      >
        {children}
      </DropdownMenuContent>
    </SubmenuContext.Provider>
  );
}

const mobileRowClass = (inGroup: boolean) =>
  cn(
    "flex cursor-pointer items-center justify-between px-4 py-4 text-left transition-transform duration-150 ease-out active:scale-[0.97]",
    inGroup
      ? "w-full bg-transparent"
      : "mx-2 my-1.5 w-[calc(100%-1rem)] rounded-md bg-accent dark:bg-accent"
  );

function DropDrawerItem({
  className,
  children,
  onSelect,
  onClick,
  icon,
  variant = "default",
  inset,
  disabled,
  ...props
}: ComponentProps<typeof DropdownMenuItem> & {
  icon?: ReactNode;
}) {
  const { isMobile } = useDropDrawerContext();
  const inGroup = useContext(GroupContext);

  if (isMobile) {
    const restProps = props as Record<string, unknown>;
    const isInSubmenu =
      typeof restProps["data-parent-submenu-id"] === "string" ||
      typeof restProps["data-parent-submenu"] === "string";

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (disabled) {
        return;
      }
      if (onClick) {
        onClick(e as unknown as ReactMouseEvent<HTMLDivElement>);
      }
      if (onSelect) {
        onSelect(e as unknown as Event);
      }
    };

    const content = (
      <button
        aria-disabled={disabled}
        className={cn(
          mobileRowClass(inGroup),
          inset ? "pl-8" : "",
          variant === "destructive"
            ? "text-destructive dark:text-destructive"
            : "",
          disabled ? "pointer-events-none opacity-50" : "",
          className
        )}
        data-disabled={disabled}
        data-inset={inset}
        data-slot="drop-drawer-item"
        data-variant={variant}
        disabled={disabled}
        onClick={handleClick}
        type="button"
        {...(restProps as HTMLAttributes<HTMLButtonElement>)}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {children}
        </span>
        {icon ? (
          <span className="flex shrink-0 items-center">{icon}</span>
        ) : null}
      </button>
    );

    if (isInSubmenu || disabled) {
      return content;
    }

    return <DrawerClose asChild>{content}</DrawerClose>;
  }

  return (
    <DropdownMenuItem
      className={className}
      data-inset={inset}
      data-slot="drop-drawer-item"
      data-variant={variant}
      disabled={disabled}
      inset={inset}
      onClick={onClick as MouseEventHandler<HTMLDivElement>}
      onSelect={onSelect}
      variant={variant}
      {...props}
    >
      <div className="flex w-full min-w-0 items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
          {children}
        </div>
        {icon ? (
          <div className="flex shrink-0 items-center [&_svg]:size-4">
            {icon}
          </div>
        ) : null}
      </div>
    </DropdownMenuItem>
  );
}

function DropDrawerSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuSeparator>) {
  const { isMobile } = useDropDrawerContext();

  if (isMobile) {
    return null;
  }

  return (
    <DropdownMenuSeparator
      className={className}
      data-slot="drop-drawer-separator"
      {...props}
    />
  );
}

function DropDrawerLabel({
  className,
  children,
  ...props
}:
  | ComponentProps<typeof DropdownMenuLabel>
  | ComponentProps<typeof DrawerTitle>) {
  const { isMobile } = useDropDrawerContext();

  if (isMobile) {
    return (
      <DrawerHeader className="p-0">
        <DrawerTitle
          className={cn(
            "px-4 py-2 font-medium text-muted-foreground text-sm",
            className
          )}
          data-slot="drop-drawer-label"
          {...props}
        >
          {children}
        </DrawerTitle>
      </DrawerHeader>
    );
  }

  return (
    <DropdownMenuLabel
      className={className}
      data-slot="drop-drawer-label"
      {...props}
    >
      {children}
    </DropdownMenuLabel>
  );
}

function DropDrawerFooter({
  className,
  children,
  ...props
}: ComponentProps<typeof DrawerFooter> | ComponentProps<"div">) {
  const { isMobile } = useDropDrawerContext();

  if (isMobile) {
    return (
      <DrawerFooter
        className={cn("p-4", className)}
        data-slot="drop-drawer-footer"
        {...props}
      >
        {children}
      </DrawerFooter>
    );
  }

  return (
    <div
      className={cn("p-2", className)}
      data-slot="drop-drawer-footer"
      {...props}
    >
      {children}
    </div>
  );
}

function DropDrawerGroup({
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  children: ReactNode;
}) {
  const { isMobile } = useDropDrawerContext();

  const childrenWithSeparators = useMemo(() => {
    if (!isMobile) {
      return children;
    }
    const childArray = Children.toArray(children);
    const filtered = childArray.filter(
      (child) => isValidElement(child) && child.type !== DropDrawerSeparator
    );
    return filtered.flatMap((child, index) => {
      if (index === filtered.length - 1) {
        return [child];
      }
      return [
        child,
        <div
          aria-hidden="true"
          className="h-px bg-border"
          key={`separator-${index}`}
        />,
      ];
    });
  }, [children, isMobile]);

  if (isMobile) {
    return (
      <GroupContext.Provider value={true}>
        {/* biome-ignore lint/a11y/useSemanticElements: menu group semantics require role group; fieldset would break menu behavior */}
        <div
          className={cn(
            "mx-2 my-3 overflow-hidden rounded-xl bg-accent dark:bg-accent",
            className
          )}
          data-drop-drawer-group
          data-slot="drop-drawer-group"
          role="group"
          {...props}
        >
          {childrenWithSeparators}
        </div>
      </GroupContext.Provider>
    );
  }

  return (
    <DropdownMenuGroup
      className={className}
      data-drop-drawer-group
      data-slot="drop-drawer-group"
      {...props}
    >
      {children}
    </DropdownMenuGroup>
  );
}

function DropDrawerSub({
  children,
  id,
  ...props
}: ComponentProps<typeof DropdownMenuSub> & {
  id?: string;
}) {
  const { isMobile } = useDropDrawerContext();
  const { registerSubmenuContent } = useContext(SubmenuContext);

  const rawId = useId();
  const submenuId = id ?? `submenu-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    if (!registerSubmenuContent) {
      return;
    }
    const contentItems: ReactNode[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === DropDrawerSubContent) {
        Children.forEach(
          (child.props as { children?: ReactNode }).children,
          (contentChild) => {
            contentItems.push(contentChild);
          }
        );
      }
    });
    if (contentItems.length > 0) {
      registerSubmenuContent(submenuId, contentItems);
    }
  }, [children, registerSubmenuContent, submenuId]);

  if (isMobile) {
    const processedChildren = Children.map(children, (child) => {
      if (!isValidElement(child)) {
        return child;
      }
      if (
        child.type === DropDrawerSubTrigger ||
        child.type === DropDrawerSubContent
      ) {
        return cloneElement(
          child as ReactElement,
          {
            ...(child.props as object),
            "data-parent-submenu-id": submenuId,
            "data-submenu-id": submenuId,
            "data-parent-submenu": submenuId,
          } as HTMLAttributes<HTMLElement>
        );
      }
      return child;
    });

    return (
      <div
        data-slot="drop-drawer-sub"
        data-submenu-id={submenuId}
        id={submenuId}
      >
        {processedChildren}
      </div>
    );
  }

  return (
    <DropdownMenuSub
      data-slot="drop-drawer-sub"
      data-submenu-id={submenuId}
      {...props}
    >
      {children}
    </DropdownMenuSub>
  );
}

function DropDrawerSubTrigger({
  className,
  inset,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuSubTrigger> & {
  icon?: ReactNode;
}) {
  const { isMobile } = useDropDrawerContext();
  const { navigateToSubmenu } = useContext(SubmenuContext);
  const inGroup = useContext(GroupContext);

  if (isMobile) {
    const typedProps = props as Record<string, unknown>;
    const { onClick: ignoredOnClick, ...restProps } = typedProps;

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (typeof ignoredOnClick === "function") {
        (ignoredOnClick as MouseEventHandler<HTMLButtonElement>)(e);
      }
      e.preventDefault();
      e.stopPropagation();
      const element = e.currentTarget as HTMLElement;
      const closest = element.closest("[data-submenu-id]");
      const submenuId =
        closest?.getAttribute("data-submenu-id") ||
        (restProps["data-parent-submenu-id"] as string) ||
        (restProps["data-parent-submenu"] as string);
      if (!submenuId) {
        return;
      }
      const title = typeof children === "string" ? children : "Submenu";
      navigateToSubmenu?.(submenuId, title);
    };

    return (
      <button
        className={cn(mobileRowClass(inGroup), inset ? "pl-8" : "", className)}
        data-inset={inset}
        data-slot="drop-drawer-sub-trigger"
        onClick={handleClick}
        type="button"
        {...(restProps as HTMLAttributes<HTMLButtonElement>)}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {children}
        </span>
        <ChevronRightIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
      </button>
    );
  }

  return (
    <DropdownMenuSubTrigger
      className={className}
      data-inset={inset}
      data-slot="drop-drawer-sub-trigger"
      inset={inset}
      {...props}
    >
      {children}
    </DropdownMenuSubTrigger>
  );
}

function DropDrawerSubContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: ComponentProps<typeof DropdownMenuSubContent>) {
  const { isMobile } = useDropDrawerContext();

  if (isMobile) {
    return null;
  }

  return (
    <DropdownMenuSubContent
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      data-slot="drop-drawer-sub-content"
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </DropdownMenuSubContent>
  );
}

export {
  DropDrawer,
  DropDrawerContent,
  DropDrawerFooter,
  DropDrawerGroup,
  DropDrawerItem,
  DropDrawerLabel,
  DropDrawerSeparator,
  DropDrawerSub,
  DropDrawerSubContent,
  DropDrawerSubTrigger,
  DropDrawerTrigger,
};
