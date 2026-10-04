import { cacheLife } from "next/cache";
import { SocialList } from "@/components/pages/social/social-list";
import { getUsersStats } from "@/data/user";

export const metadata = {
  title: "People",
  description: "Connect with fellow learners",
};

async function SocialPage() {
  "use cache";
  cacheLife("minutes");

  const users = await getUsersStats();

  return (
    <div>
      <div className="min-h-[80vh] py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              People
            </h1>
            <p className="mt-1 text-gray-600 text-sm dark:text-gray-300">
              Connect with fellow learners
            </p>
          </div>
        </header>
        <section>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <SocialList users={users} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SocialPage;
