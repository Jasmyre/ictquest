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
    <div className="min-h-[80vh] py-10">
      <h1 className="sr-only">People — Connect with fellow learners</h1>
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <SocialList users={users} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SocialPage;
