import { Sparkles, Star, Trophy } from "lucide-react";
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
  const isFollowing = userData.isFollowing;
  const { id } = await params;

  const user = (await api.user.getUserStatsById({ id })).data;

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* user-header */}
        <UserHeader isFollowing={isFollowing} user={user} />

        {/* user-stat-summary */}
        <UserStatSummary user={user} />

        {/* user-stats */}
        <UserStats user={user} userData={userData} />
      </div>
    </div>
  );
};

export type UserData = typeof userData;

const userData = {
  id: 1,
  name: "Sarah Wilson",
  username: "@sarahw",
  role: "Student",
  avatar: "/placeholder.svg?height=100&width=100",
  level: "Beginner",
  isFollowing: true,
  bio: "Passionate about web development and learning new technologies. Currently focusing on mastering HTML and CSS.",
  achievements: [
    {
      name: "Fast Learner",
      description: "Completed 5 lessons in one day",
      icon: Sparkles,
    },
    {
      name: "Perfect Score",
      description: "Achieved 100% in HTML Basics",
      icon: Star,
    },
    {
      name: "Consistent Learner",
      description: "Logged in for 7 days straight",
      icon: Trophy,
    },
  ],
  stats: {
    lessonsCompleted: 12,
    achievementsEarned: 5,
    daysStreak: 7,
    totalPoints: 1250,
  },
  progress: {
    "HTML Basics": 80,
    "CSS Fundamentals": 60,
    "JavaScript Essentials": 40,
    "Responsive Design": 20,
  },
  recentActivity: [
    { type: "completed", lesson: "HTML Tables", date: "2 days ago" },
    { type: "achieved", achievement: "Fast Learner", date: "3 days ago" },
    { type: "started", lesson: "CSS Grid", date: "4 days ago" },
  ],
};

export default page;
