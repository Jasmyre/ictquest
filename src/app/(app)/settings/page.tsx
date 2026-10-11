import { SettingsTabs } from "@/components/settings/settings-tabs";
import { api } from "@/trpc/server";

async function page() {
  // Owner-scoped Settings reads (spec #81, tickets #82/#84): the Profile
  // and Account panels hydrate from server-fetched rows; writes go through
  // the `user.updateProfile` / `user.updateEmail` / `user.updatePassword` /
  // `user.setPassword` Procedures from the client forms.
  const [profile, account] = await Promise.all([
    api.user.getProfile(),
    api.user.getAccount(),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">Settings</h1>
      <SettingsTabs account={account.data} profile={profile.data} />
    </div>
  );
}

export default page;
