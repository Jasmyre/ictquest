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
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">People — Connect with fellow learners</h1>
      <SocialList users={users} />
    </main>
  );
}

export default SocialPage;
