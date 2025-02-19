
import { auth } from "@/auth";
import { ProfileCardGrid } from "@/components/ProfileCardGrid";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return <div>You are not welcome!</div>
  
  const user = session.user;

  console.log(user)

  return (
    <main>
      <div className="py-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
            Your Profile
          </h1>
        </header>
        <ProfileCardGrid name={user.name!} email={user.email!}/>
      </div>
    </main>
  );
}
