import { ProfileInfoCard } from "@/components/pages/profile/profile-info-card";

export default async function ProfilePage() {
  // if (!user) {
  //   return (
  //     <main>
  //       <div className="py-10">
  //         <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  //           <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
  //             Your Profile
  //           </h1>
  //         </header>
  //         <div className="text-gray-500 dark:text-gray-400">
  //           User profile not found.
  //         </div>
  //       </div>
  //     </main>
  //   );
  // }

  return (
    <main>
      <div className="min-h-[80vh] py-10">
        <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
            Your Profile
          </h1>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProfileInfoCard />
          </div>
        </div>
      </div>
    </main>
  );
}
