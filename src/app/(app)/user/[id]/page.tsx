import { notFound } from "next/navigation";
import PrivateAccountCard from "@/components/pages/user/[id]/private-account-card";
import UserHeader from "@/components/pages/user/[id]/user-header";
import UserStatSummary from "@/components/pages/user/[id]/user-stat-summary";
import UserStats from "@/components/pages/user/[id]/user-stats";
import { api } from "@/trpc/server";

/**
 * Public profile by id (#90; private branch, route states in #94).
 *
 * The loading boundary lives in `loading.tsx` so the shell prerenders as a
 * static skeleton. A missing learner maps to the `not-found.tsx` boundary;
 * any other load failure propagates to `error.tsx` for a retry.
 */
async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let user: Awaited<ReturnType<typeof api.dashboard.getDashboardById>>["data"];
  try {
    user = (await api.dashboard.getDashboardById({ id })).data;
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }
    throw error;
  }

  const displayName = user.userName ?? "Learner";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="sr-only">{displayName}'s profile</h1>
      <UserHeader user={user} />
      {user.isPrivate ? (
        <PrivateAccountCard />
      ) : (
        <>
          <UserStatSummary user={user} />
          <UserStats user={user} />
        </>
      )}
    </div>
  );
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "NOT_FOUND"
  );
}

export default page;
