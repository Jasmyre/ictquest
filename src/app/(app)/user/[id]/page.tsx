import { notFound } from "next/navigation";
import { Suspense } from "react";
import UserHeader from "@/components/pages/user/[id]/user-header";
import UserStatSummary from "@/components/pages/user/[id]/user-stat-summary";
import UserStats from "@/components/pages/user/[id]/user-stats";
import { api } from "@/trpc/server";

async function page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <Renderer params={params} />
    </Suspense>
  );
}

const Renderer = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let user: Awaited<ReturnType<typeof api.dashboard.getDashboardById>>["data"];
  try {
    user = (await api.dashboard.getDashboardById({ id })).data;
  } catch {
    notFound();
  }

  const displayName = user.userName ?? "Learner";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">{displayName}'s profile</h1>
      <UserHeader user={user} />
      <UserStatSummary user={user} />
      <UserStats user={user} />
    </div>
  );
};

export default page;
