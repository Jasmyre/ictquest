import { Ban, Flag, MoreVertical, UserPlus } from "lucide-react";
import {
  DropDrawer,
  DropDrawerContent,
  DropDrawerItem,
  DropDrawerTrigger,
} from "@/components/dropdrawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/server/schemas/dashboard";

/**
 * Bannerless public profile header (#92).
 *
 * Card over card tokens only: avatar, real display name, a muted meta line,
 * and the public biography when the account is public and has one. Follow,
 * Report, and Block stay visibly disabled TODOs per ADR-0009 — no mutation
 * or unlock handler ships, only the honest affordance.
 */
type UserHeaderProps = {
  user: DashboardData;
};

const WHITESPACE_PATTERN = /\s+/;

function initials(name: string | null): string {
  if (!name) {
    return "?";
  }
  return name
    .trim()
    .split(WHITESPACE_PATTERN)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const UserHeader = ({ user }: UserHeaderProps) => {
  const displayName = user.userName ?? "Unnamed learner";
  const showBiography = !user.isPrivate && user.biography !== null;

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
              <AvatarImage
                alt={`${displayName} avatar`}
                src={user.image ?? undefined}
              />
              <AvatarFallback aria-hidden="true" className="text-xl">
                {initials(user.userName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="font-bold text-foreground text-xl tracking-tight sm:text-2xl">
                {displayName}
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Level {user.level} · {user.totalSubtopicsCompleted} lessons ·{" "}
                {user.totalAchievements} achievements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              aria-disabled="true"
              className="cursor-pointer transition-transform duration-150 ease-out active:scale-[0.97]"
              onClick={(event) => event.preventDefault()}
              title="Follow coming soon"
            >
              <UserPlus aria-hidden="true" className="h-4 w-4" />
              Follow
            </Button>
            <DropDrawer>
              <DropDrawerTrigger asChild>
                <Button
                  aria-label={`More actions for ${displayName}`}
                  className="h-9 w-9 cursor-pointer p-0 transition-transform duration-150 ease-out active:scale-[0.97]"
                  variant="ghost"
                >
                  <MoreVertical aria-hidden="true" className="h-4 w-4" />
                </Button>
              </DropDrawerTrigger>
              <DropDrawerContent align="end">
                <DropDrawerItem disabled>
                  <Flag aria-hidden="true" className="h-4 w-4" />
                  Report user
                </DropDrawerItem>
                <DropDrawerItem disabled>
                  <Ban aria-hidden="true" className="h-4 w-4" />
                  Block user
                </DropDrawerItem>
              </DropDrawerContent>
            </DropDrawer>
          </div>
        </div>

        {showBiography ? (
          <p className="mt-4 text-balance text-muted-foreground text-sm leading-relaxed">
            {user.biography}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default UserHeader;
