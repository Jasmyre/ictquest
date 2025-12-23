import { Flag, UserMinus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { api } from "@/trpc/server";

type UserHeaderProps = {
  isFollowing: boolean;
  user: Awaited<ReturnType<typeof api.user.getUserStatsById>>["data"];
};

const UserHeader = ({ isFollowing, user }: UserHeaderProps) => (
  <Card className="mb-8 overflow-hidden border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <div className="h-32 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10" />
    <CardContent className="relative pt-0">
      <div className="-mt-12 md:-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
          <Avatar className="h-24 w-24 border-4 border-white md:h-32 md:w-32 dark:border-gray-800">
            <AvatarImage alt="User avatar" src={user.image ?? undefined} />
            <AvatarFallback className="text-6xl">
              {user.userName?.split(" ").map((n) => n[0])[0] ??
                "Unknown username"}
            </AvatarFallback>
          </Avatar>
          <div className="text-left md:text-left">
            <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
              {user.userName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">@{user?.id}</p>
            <br className="hidden max-sm:block" />
            <div className="mt-2 flex items-center gap-2">
              <Badge
                className="border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                variant="outline"
              >
                Student
              </Badge>
              <Badge className="border-indigo-100 bg-indigo-100 text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-300">
                Level {user?.level}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3 md:self-center">
          <Button
            className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
            variant={isFollowing ? "secondary" : "default"}
          >
            {isFollowing ? (
              <>
                <UserMinus className="mr-2 h-4 w-4" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Follow
              </>
            )}
          </Button>
          <Button
            className="cursor-pointer hover:bg-red-50 hover:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            variant="card-button"
          >
            <Flag className="h-4 w-4" />
            <span className="sr-only">Report user</span>
          </Button>
        </div>
      </div>
      <p className="mt-6 text-gray-600 dark:text-gray-400">Bio not available</p>
    </CardContent>
  </Card>
);

export default UserHeader;
