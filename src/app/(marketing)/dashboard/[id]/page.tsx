import { Suspense } from "react";
import UserHeader from "@/components/pages/user/[id]/user-header";
import UserStatSummary from "@/components/pages/user/[id]/user-stat-summary";
import { api } from "@/trpc/server";

/**
 * Public dashboard share link (Slice 5, #62).
 *
 * Anonymous-readable derived view over visible progress state, fed by the
 * public rate-limited `dashboard.getDashboardById` procedure — the same
 * strict contract as the owner read, with no biography key. Always reads
 * fresh (ADR 0005): no cache directive here, `private, no-store` at the
 * `/api/v1` catch-all, network-only in the service worker.
 */
async function page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense>
      <Renderer params={params} />
    </Suspense>
  );
}

const Renderer = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const dashboard = (await api.dashboard.getDashboardById({ id })).data;

  return (
    <div className="py-10" data-testid="dashboard-share">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <UserHeader isFollowing={false} user={dashboard} />
        <UserStatSummary user={dashboard} />
      </div>
    </div>
  );
};

export default page;
