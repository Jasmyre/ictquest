import { ProfileSkeleton } from "@/components/pages/user/[id]/profile-skeleton";

/**
 * Route-level loading boundary (#94). Provides the Suspense boundary the
 * page's uncached by-id read needs under `cacheComponents` and mirrors the
 * shell so navigation never flashes a blank frame.
 */
export default function LoadingUserProfile() {
  return <ProfileSkeleton />;
}
