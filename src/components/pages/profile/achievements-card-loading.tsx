import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AchievementsCardLoading = () => (
  <Card
    aria-busy="true"
    aria-label="Loading achievements"
    data-testid="achievement-inventory"
  >
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
    </CardHeader>
    <CardContent>
      <ul className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <li className="flex items-center gap-3 py-3" key={i}>
            <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
