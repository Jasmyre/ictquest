
import { ProfileCardGrid } from "@/components/ProfileCardGrid";

export default function ProfilePage() {
  return (
    <main>
      <div className="py-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Your Profile
          </h1>
        </header>
        <ProfileCardGrid />
      </div>
    </main>
  );
}
