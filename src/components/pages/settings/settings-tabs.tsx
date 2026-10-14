"use client";

import {
  Check,
  ChevronDown,
  KeyRound,
  Palette,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { Fragment, useState } from "react";
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerItem,
  DropDrawerLabel,
  DropDrawerTrigger,
} from "@/components/dropdrawer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RouterOutputs } from "@/trpc/react";
import { AppearanceSettingsCard } from "./appearance-settings-card";
import { DangerSettingsCard } from "./danger-settings-card";
import { EmailSettingsCard } from "./email-settings-card";
import { PasswordSettingsCard } from "./password-settings-card";
import { ProfileSettingsCard } from "./profile-settings-card";

type SettingsData = RouterOutputs["user"]["getSettings"]["data"];

type TabValue = "profile" | "appearance" | "account" | "danger";

const TABS: Array<{
  value: TabValue;
  label: string;
  icon: typeof UserRound;
  hint: string;
}> = [
  {
    value: "profile",
    label: "Profile",
    icon: UserRound,
    hint: "Name, bio, visibility",
  },
  { value: "appearance", label: "Appearance", icon: Palette, hint: "Theme" },
  {
    value: "account",
    label: "Account",
    icon: KeyRound,
    hint: "Email, password",
  },
  { value: "danger", label: "Danger", icon: TriangleAlert, hint: "Reset data" },
];

const TRIGGER =
  "w-full cursor-pointer justify-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-muted/60 data-[state=active]:bg-muted data-[state=active]:shadow-none";

export function SettingsTabs({ initial }: { initial: SettingsData }) {
  const [tab, setTab] = useState<TabValue>("profile");
  const active = TABS.find((item) => item.value === tab) ?? TABS[0];

  const select = (value: TabValue) => {
    setTab(value);
  };

  return (
    <Tabs
      className="mt-6 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[280px_minmax(0,1fr)]"
      onValueChange={(value) => {
        select(value as TabValue);
      }}
      orientation="vertical"
      value={tab}
    >
      {/* Mobile: a section switcher that opens a bottom drawer instead of a
          long vertical list. Hidden on sm+ where the rail takes over. */}
      <div className="sm:hidden">
        <DropDrawer>
          <DropDrawerTrigger asChild>
            <button
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left shadow-xs transition-colors duration-150 ease-out hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.99]"
              type="button"
            >
              <active.icon
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-sm leading-tight">
                  {active.label}
                </span>
                <span className="block truncate text-muted-foreground text-xs">
                  {active.hint}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground"
              />
            </button>
          </DropDrawerTrigger>
          <DropDrawerContent>
            <DropDrawerLabel>Sections</DropDrawerLabel>
            {TABS.map((item) => (
              <DropDrawerItem
                icon={
                  tab === item.value ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : null
                }
                key={item.value}
                onSelect={() => {
                  select(item.value);
                }}
              >
                <item.icon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-sm leading-tight">
                    {item.label}
                  </span>
                  <span className="block truncate text-muted-foreground text-xs">
                    {item.hint}
                  </span>
                </span>
              </DropDrawerItem>
            ))}
          </DropDrawerContent>
        </DropDrawer>
      </div>

      {/* sm and up: vertical rail with full-width rows. */}
      <Card
        aria-label="Settings sections"
        className="hidden overflow-hidden p-1.5 sm:block"
      >
        <TabsList
          aria-label="Settings sections"
          className="flex h-auto w-full flex-col items-stretch gap-0.5 bg-transparent p-0"
        >
          {TABS.map((item, index) => (
            <Fragment key={item.value}>
              {index > 0 ? <Separator className="my-1" /> : null}
              <TabsTrigger className={TRIGGER} value={item.value}>
                <item.icon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-medium text-sm leading-tight">
                    {item.label}
                  </span>
                  <span className="block truncate text-muted-foreground text-xs">
                    {item.hint}
                  </span>
                </span>
              </TabsTrigger>
            </Fragment>
          ))}
        </TabsList>
      </Card>

      <div className="min-w-0">
        <div className="stagger-enter flex flex-col gap-3 sm:gap-4" key={tab}>
          <TabsContent className="mt-0" value="profile">
            <ProfileSettingsCard initial={initial} />
          </TabsContent>
          <TabsContent className="mt-0" value="appearance">
            <AppearanceSettingsCard />
          </TabsContent>
          <TabsContent className="mt-0" value="account">
            <div className="flex flex-col gap-3 sm:gap-4">
              <EmailSettingsCard initial={initial} />
              <PasswordSettingsCard initial={initial} />
            </div>
          </TabsContent>
          <TabsContent className="mt-0" value="danger">
            <DangerSettingsCard />
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
