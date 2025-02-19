import { User } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CustomTooltip } from "@/components/CustomTooltip";

interface InfoCardProps {
  name: string | null;
  email: string | null;
}

export const InfoCard = ({ name, email }: InfoCardProps) => {
  return (
    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-semibold text-gray-900 dark:text-gray-100">
          <div className="flex min-w-min flex-wrap gap-2">
            <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <p>Personal Information</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={name!}
              className="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <CustomTooltip content={() => "Email can not be changed"} className="w-full">
              <Input
                id="email"
                type="email"
                defaultValue={email!}
                disabled
                style={{
                  cursor: "pointer"
                }}
                className="cursor-pointer border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </CustomTooltip>
          </div>
          <Button
            type="submit"
            className="border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
