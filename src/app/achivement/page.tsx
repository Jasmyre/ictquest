// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  // State to track the number of clicks
  const [clickCount, setClickCount] = useState(0);
  // State to track if the achievement has been unlocked
  const [isAchievementUnlocked, setIsAchievementUnlocked] = useState(false);

  // Replace with the actual current user's ID from your authentication system
  const currentUserId = "cm7h7bvzb0000hpbogs4hvxi1";

  // biome-ignore lint/correctness/useExhaustiveDependencies: unlockAchievement changes on every re-render and should not be used as a hook dependency.
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
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Allow non-interactive element interaction for achievements purposes
    // biome-ignore lint/a11y/noStaticElementInteractions: Allow non-interactive element interaction for achievements purposes
    <div
      onClick={() => setClickCount((prev) => prev + 1)}
      onKeyUp={() => setClickCount((prev) => prev + 1)}
      style={{ padding: "2rem", textAlign: "center" }}
    >
      <h1>Next.js Achievement System</h1>
      <p>Click anywhere to increase the click count.</p>
      <p>Click Count: {clickCount}</p>
      {isAchievementUnlocked ? (
        <p style={{ color: "green" }}>
          Achievement &quot;Clicktastic&quot; unlocked!
        </p>
      ) : (
        <p>Keep clicking to unlock an achievement!</p>
      )}
    </div>
  );
}
