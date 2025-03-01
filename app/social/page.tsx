"use client";

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
import {
    Ban,
    Flag,
    MoreVertical,
    Search,
    Sparkles,
    Trophy,
    UserPlus
} from "lucide-react";
import Link from "next/link";

// Sample user data (unchanged)
const users = [
  {
    id: 1,
    name: "Sarah Wilson",
    username: "@sarahw",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "Beginner",
    following: true,
    achievements: 5,
    completedLessons: 12,
  },
  {
    id: 2,
    name: "Michael Chen",
    username: "@mchen",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "Advanced",
    following: false,
    achievements: 15,
    completedLessons: 48,
  },
  {
    id: 3,
    name: "Emma Thompson",
    username: "@emmathompson",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "Intermediate",
    following: true,
    achievements: 8,
    completedLessons: 24,
  },
  {
    id: 4,
    name: "James Rodriguez",
    username: "@jamesr",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "Beginner",
    following: false,
    achievements: 3,
    completedLessons: 6,
  },
  {
    id: 5,
    name: "Lisa Park",
    username: "@lisapark",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "Advanced",
    following: false,
    achievements: 20,
    completedLessons: 60,
  },
  {
    id: 6,
    name: "David Kim",
    username: "@davidk",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
    level: "Intermediate",
    following: true,
    achievements: 10,
    completedLessons: 30,
  },
];

function page() {
  // State logic remains the same

  return (
    <div className="py-10 min-h-[80vh]">
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                Community
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Connect with fellow learners
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="w-full border-gray-200 bg-white pl-9 focus-visible:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
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
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mx-auto mb-8 w-full max-w-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <TabsTrigger
                value="all"
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Following
              </TabsTrigger>
              <TabsTrigger
                value="teachers"
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Teachers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="flex flex-col border-gray-200 bg-white transition-shadow duration-200 hover:border-indigo-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                  >
                    <CardContent className="flex flex-col gap-6 p-6">
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/profile/${user.id}`}
                          className="group flex items-center gap-4"
                        >
                          <Avatar className="h-12 w-12 border-2 border-gray-200 transition-colors duration-200 group-hover:border-indigo-600 dark:border-gray-600">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600 dark:text-white">
                              {user.name}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.username}
                            </p>
                          </div>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
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

                      {/* Badges */}
                      <div className="flex items-center gap-2">
                        {/* <Badge
                          variant="outline"
                          className="border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {user.role}
                        </Badge> */}
                        <Badge className="border-indigo-100 bg-indigo-100 text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-300">
                          Level {user.level}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>{user.achievements} achievements</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          <span>{user.completedLessons} lessons</span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="mt-auto flex items-center gap-3">
                        <Button
                          variant={
                            // followingStatus[user.id] ? "secondary" : "default"
                            "default"
                          }
                          //   onClick={() => toggleFollow(user.id)}
                          className="w-full flex-1 place-self-end bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
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
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Follow
                          </>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                          asChild
                        >
                          <Link href={`/profile/${user.id}`}>View Profile</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Following and Teachers tabs content - similar modifications */}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default page;