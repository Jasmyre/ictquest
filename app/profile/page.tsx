import { auth } from "@/auth";
import { ProfileCardGrid } from "@/components/ProfileCardGrid";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return null;

  const user = await getUserById(session.user.id!);
  const id = user?.id;

  if (!user?.userName) {
    await db.user.update({
      where: { id },
      data: {
        userName: user?.name,
      },
    });
  }

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
        <ProfileCardGrid user={user} />
      </div>
    </main>
  );
}
