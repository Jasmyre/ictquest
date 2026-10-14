import { KeySquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TokensPlaceholderCard() {
  return (
    <Card aria-disabled="true" className="opacity-80">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeySquare
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            API tokens
          </CardTitle>
          <Badge variant="secondary">In development</Badge>
        </div>
        <CardDescription>
          Personal access tokens for scripts and integrations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-dashed px-6 py-16 text-center">
          <p className="font-medium">Token management is on its way</p>
          <p className="mt-1 text-muted-foreground text-sm">
            This tab is intentionally quiet — nothing to click yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
