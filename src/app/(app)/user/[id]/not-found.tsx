import { Card, CardContent } from "@/components/ui/card";

/**
 * Not-found boundary for `/user/[id]` (#94): a missing learner resolves to
 * this card instead of leaking the read failure into the error boundary.
 */
export default function UserNotFound() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Card className="mt-6" data-testid="user-not-found">
        <CardContent className="pt-6">
          <p className="font-medium text-sm">Profile not found</p>
          <p className="mt-1 text-muted-foreground text-sm">
            This learner may have been removed or the link is incorrect.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
