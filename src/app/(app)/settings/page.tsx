import { SettingsTabs } from "@/components/settings/settings-tabs";
import { api } from "@/trpc/server";

async function page() {
  // Owner-scoped Settings read (spec #81, ticket #82): the Profile panel
  // hydrates from the server-fetched row; writes go through the
  // `user.updateProfile` Procedure from the client form.
  const profile = await api.user.getProfile();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">Settings</h1>
      <SettingsTabs profile={profile.data} />
    </div>
  );
}

export default page;
