import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const ProfileInfoCardLoading = () => {
  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-semibold text-2xl text-gray-900 dark:text-gray-100">
          <div className="flex min-w-min flex-wrap gap-2">
            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <p>Personal Information</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-8">
          <FieldSet>
            <FieldGroup>
              {/* User name */}
              <Field>
                <FieldLabel htmlFor={"user-name"}>Username</FieldLabel>
                <Input
                  className="bg-muted"
                  disabled
                  id="user-name"
                  placeholder="Loading..."
                />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor={"email"}>email</FieldLabel>
                <Input
                  className="bg-muted"
                  disabled
                  id="email"
                  placeholder="Loading..."
                />
              </Field>
              <div>
                <Button
                  className="cursor-pointer border border-border bg-muted text-foreground"
                  disabled
                  type="submit"
                  variant={"ghost"}
                >
                  Submit
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};
