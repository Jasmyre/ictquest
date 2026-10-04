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
    <div className="py-4 sm:py-10">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
        <header className="mb-3 sm:mb-8">
          <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
            People
          </h1>
          <p className="mt-1 text-muted-foreground text-sm sm:text-base">
            Connect with fellow learners
          </p>
        </header>
        <main>
          <SocialList users={users} />
        </main>
      </div>
    </div>
  );
}

export default SocialPage;
