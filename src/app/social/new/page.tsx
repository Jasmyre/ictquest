import {
  Ban,
  Flag,
  MoreVertical,
  Search,
  Sparkles,
  Trophy,
  UserPlus,
} from "lucide-react";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUsersStats } from "@/data/user";

async function page() {
  "use cache";
  cacheLife("minutes");

  const users = await getUsersStats();
  console.log(users);

  return (
    <div className="min-h-[80vh] py-10">
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-white">
                Community
              </h1>
              <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                Connect with fellow learners
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                <Input
                  className="w-full border-gray-200 bg-white pl-9 focus-visible:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Search Users..."
                  //   value={searchQuery}
                  //   onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs className="w-full" defaultValue="all">
            <TabsList className="mx-auto mb-8 w-full max-w-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                value="all"
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                value="following"
              >
                Following
              </TabsTrigger>
              {/* <TabsTrigger
                value="teachers"
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Teachers
              </TabsTrigger> */}
            </TabsList>
            <TabsContent className="mt-0" value="all">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <Card
                    className="flex flex-col border-gray-200 bg-white transition-shadow duration-200 hover:border-indigo-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                    key={user.id}
                  >
                    <CardContent className="flex flex-col gap-6 p-6">
                      <div className="flex items-start justify-between">
                        <Link
                          className="group flex items-center gap-4"
                          href={`/user/${user.id}`}
                        >
                          <Avatar className="h-12 w-12 border-2 border-gray-200 transition-colors duration-200 group-hover:border-gray-500 dark:border-gray-600">
                            <AvatarImage
                              alt={user.username ?? "Null Name"}
                              src={user.avatar ?? undefined}
                            />
                            <AvatarFallback className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {String(user.username)
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="font-semibold text-gray-600 text-lg transition-colors duration-200 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-300">
                              {user.username}
                            </h2>
                            <p className="text-gray-600 text-sm dark:text-gray-400">
                              {user.id}
                            </p>
                          </div>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                              variant="ghost"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-900/20">
                              <Flag className="mr-2 h-4 w-4" />
                              Report User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-900/20">
                              <Ban className="mr-2 h-4 w-4" />
                              Block User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className="border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          variant="outline"
                        >
                          Student
                        </Badge>
                        <Badge className="border-indigo-100 bg-indigo-100 text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-300">
                          Level {user.level}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 text-sm dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{user.numberOfAchievements} achievements</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          <span>{user.numberOfSubtopics} lessons</span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center gap-3">
                        <Button
                          className="w-full flex-1 place-self-end bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                          //   onClick={() => toggleFollow(user.id)}
                          variant={
                            // followingStatus[user.id] ? "secondary" : "default"
                            "default"
                          }
                        >
                          {/* {followingStatus[user.id] ? (
                            <>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Unfollow
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Follow
                            </>
                          )} */}
                          <UserPlus className="mr-2 h-4 w-4" />
                          Follow
                        </Button>
                        <Button
                          asChild
                          className="flex-1 border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          variant="outline"
                        >
                          <Link href={`/user/${user.id}`}>View Profile</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default page;
