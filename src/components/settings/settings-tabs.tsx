"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountForm, type SettingsAccount } from "./account-form";
import { AppearanceForm } from "./appearance-form";
import { DangerPanel } from "./danger-panel";
import { ProfileForm, type SettingsProfile } from "./profile-form";

/**
 * Settings tab shell (spec #81, ticket #82).
 *
 * Real `tablist` semantics via Radix Tabs (arrow-key navigation built
 * in). Mobile renders the grouped-card row tokens (rounded card,
 * separators, reduced-motion safe); desktop docks the same list as a
 * sidebar. Profile (#82), Appearance (#83, local-only via
 * `next-themes`, no server persistence), Account (#84), and Danger
 * (#85, duplicates profile reset actions) are live — Tokens stays
 * disabled with an exact `In development` badge.
 */
export function SettingsTabs({
  profile,
  account,
}: {
  profile: SettingsProfile;
  account: SettingsAccount;
}) {
  return (
    <Tabs
      className="flex w-full flex-col gap-4 md:flex-row md:items-start"
      defaultValue="profile"
    >
      <TabsList
        aria-label="Settings sections"
        className="flex h-auto w-full flex-col items-stretch justify-start rounded-xl border bg-card p-1 text-muted-foreground motion-reduce:transition-none md:w-56 md:shrink-0"
      >
        <TabsTrigger
          className="justify-start rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-muted data-[state=active]:text-foreground motion-reduce:transition-none [&+button]:border-border [&+button]:border-t"
          value="profile"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger
          className="justify-start rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-muted data-[state=active]:text-foreground motion-reduce:transition-none [&+button]:border-border [&+button]:border-t"
          value="appearance"
        >
          Appearance
        </TabsTrigger>
        <TabsTrigger
          className="justify-start rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-muted data-[state=active]:text-foreground motion-reduce:transition-none [&+button]:border-border [&+button]:border-t"
          value="account"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          aria-disabled="true"
          className="cursor-not-allowed justify-start gap-2 rounded-lg px-3 py-2 text-left font-medium text-sm opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none [&+button]:border-border [&+button]:border-t"
          disabled
          value="tokens"
        >
          Tokens
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-muted-foreground text-xs">
            In development
          </span>
        </TabsTrigger>
        <TabsTrigger
          className="justify-start rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-muted data-[state=active]:text-foreground motion-reduce:transition-none [&+button]:border-border [&+button]:border-t"
          value="danger"
        >
          Danger
        </TabsTrigger>
      </TabsList>

      <div className="min-w-0 flex-1">
        <TabsContent className="mt-0" value="profile">
          <ProfileForm profile={profile} />
        </TabsContent>
        <TabsContent className="mt-0" value="appearance">
          <AppearanceForm />
        </TabsContent>
        <TabsContent className="mt-0" value="account">
          <AccountForm account={account} />
        </TabsContent>
        <TabsContent className="mt-0" value="danger">
          <DangerPanel />
        </TabsContent>
      </div>
    </Tabs>
  );
}
