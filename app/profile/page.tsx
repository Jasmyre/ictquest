import { auth } from "@/auth";
import { ProfileCardGrid } from "@/components/ProfileCardGrid";
import { getUserById } from "@/data/user";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    return (
      <main>
        <div className="py-10">
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              Your Profile
            </h1>
          </header>
          <div className="text-gray-500 dark:text-gray-400">
            User profile not found.
          </div>
        </div>
      </main>
    );
  };

  const user = await getUserById(session.user.id!);

  if (!user) {
    return (
      <main>
        <div className="py-10">
          <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
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
      <div className="py-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Your Profile
          </h1>
        </header>
        <ProfileCardGrid user={user!} />
      </div>
    </main>
  );
}
