import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Private-account branch (#94).
 *
 * A private profile shows the header plus this single card instead of the
 * summary and tabs: the redacted read already resolves biography to null and
 * progress/achievements to empty, so there is nothing else to render.
 */
const PrivateAccountCard = () => (
  <Card data-testid="private-account-card">
    <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Lock aria-hidden="true" className="size-6 text-muted-foreground" />
      </span>
      <h2 className="font-medium text-foreground">This account is private</h2>
      <p className="max-w-sm text-balance text-muted-foreground text-sm">
        This learner keeps their progress and achievements private. Only they
        can see their profile details.
      </p>
    </CardContent>
  </Card>
);

export default PrivateAccountCard;
