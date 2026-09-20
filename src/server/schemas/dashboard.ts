import { z } from "zod";

/**
 * Dashboard contracts (Slice 5, #62).
 *
 * Derived summary view over visible progress state. Shapes are
 * field-identical to the prior progress `stats` shapes so the rename is a
 * vocabulary move with zero behavior change — except the approved additions
 * (dashboard rename itself). Strict objects: unknown fields fail loudly,
 * never strip-drift. No biography key ever enters this contract (share-safe).
 */

export const dashboardByIdSchema = z.strictObject({
  id: z.string().min(1),
});

export type DashboardByIdInput = z.infer<typeof dashboardByIdSchema>;

export const dashboardDataSchema = z.strictObject({
  userName: z.string().nullable(),
  id: z.string(),
  image: z.string().nullable(),
  totalAchievements: z.number(),
  totalSubtopicsCompleted: z.number(),
  level: z.string(),
  totalProgress: z.number(),
  progressData: z.array(
    z.strictObject({
      topic: z.string(),
      subtopics: z.array(z.string()),
    })
  ),
});

export const dashboardOutputSchema = z.strictObject({
  success: z.literal(true),
  data: dashboardDataSchema,
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;
export type DashboardOutput = z.infer<typeof dashboardOutputSchema>;
