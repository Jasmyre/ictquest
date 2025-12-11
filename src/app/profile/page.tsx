import { auth } from "@/auth";
import { ProfileCardGrid } from "@/components/profile-card-grid";
import { getUserById } from "@/data/user";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <main>
        <div className="py-10">
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              Your Profile
            </h1>
          </header>
          <div className="text-gray-500 dark:text-gray-400">
            User profile not found.
          </div>
        </div>
      </main>
    );
  }

  const user = await getUserById(session.user.id ?? null);

  if (!user) {
    return (
      <main>
        <div className="py-10">
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              Your Profile
            </h1>
          </header>
          <div className="text-gray-500 dark:text-gray-400">
            User profile not found.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="min-h-[80vh] py-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
            Your Profile
          </h1>
        </header>
        <ProfileCardGrid user={user} />
      </div>
    </main>
  );
}
