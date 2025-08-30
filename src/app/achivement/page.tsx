// app/page.tsx
"use client";

import { useEffect, useState } from "react";

// Define a type for achievements
// type Achievement = {
//   name: string;
//   description: string;
// };

// Our list of achievements (for example purposes)
// const achievementsList: Achievement[] = [
//   {
//     name: "Clicktastic",
//     description: "Click 1000 times",
//   },
// ];

export default function HomePage() {
  // State to track the number of clicks
  const [clickCount, setClickCount] = useState(0);
  // State to track if the achievement has been unlocked
  const [isAchievementUnlocked, setIsAchievementUnlocked] = useState(false);

  // Replace with the actual current user's ID from your authentication system
  const currentUserId = "cm7h7bvzb0000hpbogs4hvxi1";

  useEffect(() => {
    // When the click count reaches 1000 and the achievement hasn't been unlocked, attempt to unlock it.
    if (clickCount >= 10 && !isAchievementUnlocked) {
      unlockAchievement();
    }
  }, [clickCount, isAchievementUnlocked]);

  // Call the API endpoint to unlock the achievement
  async function unlockAchievement() {
    try {
      const response = await fetch("/api/unlock-achievement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          achievementName: "Clicktastic",
        }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Achievement unlocked:", result);
        setIsAchievementUnlocked(true);
      } else {
        console.error("Failed to unlock achievement:", result);
      }
    } catch (error) {
      console.error("Error unlocking achievement:", error);
    }
  }

  return (
    <div
      style={{ padding: "2rem", textAlign: "center" }}
      onClick={() => setClickCount((prev) => prev + 1)}
    >
      <h1>Next.js Achievement System</h1>
      <p>Click anywhere to increase the click count.</p>
      <p>Click Count: {clickCount}</p>
      {isAchievementUnlocked ? (
        <p style={{ color: "green" }}>Achievement &quot;Clicktastic&quot; unlocked!</p>
      ) : (
        <p>Keep clicking to unlock an achievement!</p>
      )}
    </div>
  );
}
