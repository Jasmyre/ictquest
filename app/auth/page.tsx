import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { LogInForm } from "./LogInForm";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn} from "@/auth";

export default async function AuthPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center max-sm:px-4">
      <Card className="w-full max-w-md border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to ICTQuest
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 gap-2 bg-gray-200 dark:bg-gray-600">
              <TabsTrigger
                value="signin"
                className="text-gray-500 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-500 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-300"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-gray-500 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-500 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <LogInForm />
              <Button
                variant="link"
                className="mt-2 p-0 text-indigo-400 hover:text-indigo-400 dark:text-gray-300"
              >
                Forgot password?
              </Button>
            </TabsContent>
            <TabsContent value="signup">
              <form className="space-y-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-gray-800 dark:text-gray-300"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-1 border-gray-400 dark:border-gray-600"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-gray-800 dark:text-gray-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1 border-gray-400 dark:border-gray-600"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="password border-gray-600"
                    className="text-gray-800 dark:text-gray-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="mt-1 border-gray-400 dark:border-gray-600"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-400"
                >
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex flex-col gap-10">
            <div className="relative">
              <Separator className="absolute bottom-[50%] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-400" />
              <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-50 px-4 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                OR
              </span>
            </div>
            <div className="space-y-2">
              <form
                action={async () => {
                  "use server";

                  await signIn("google", {
                    redirectTo: "/"
                  });
                }}
              >
                <Button
                  variant="outline"
                  className="relative flex w-full justify-center border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  <FaGoogle className="absolute bottom-[50%] left-8 top-[50%] translate-x-[-50%] translate-y-[-50%]" />
                  <span>Continue with Google</span>
                </Button>
              </form>

              <form
                action={async () => {
                  "use server";

                  await signIn("github", {
                    callbackUrl: DEFAULT_LOGIN_REDIRECT,
                  });
                }}
              >
                <Button
                  variant="outline"
                  className="relative flex w-full justify-center border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                >
                  <FaFacebook className="absolute bottom-[50%] left-8 top-[50%] translate-x-[-50%] translate-y-[-50%]" />
                  <span>Continue with Facebook</span>
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
