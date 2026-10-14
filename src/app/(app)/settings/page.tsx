import type { Metadata } from "next";
import { SettingsTabs } from "@/components/pages/settings/settings-tabs";
import { api } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your profile, appearance, account, and data.",
};

async function SettingsPage() {
  const settings = await api.user.getSettings();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">Settings</h1>
      <SettingsTabs initial={settings.data} />
    </div>
  );
}

export default SettingsPage;
