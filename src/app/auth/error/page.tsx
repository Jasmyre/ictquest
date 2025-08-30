import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center max-sm:px-4">
      <Card className="w-full max-w-md border-gray-300 bg-white text-center dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Something went wrong!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size={"sm"} variant={"outline"}>
            <Link href={"/auth"}>Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
