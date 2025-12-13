import { FaGithub, FaGoogle } from "react-icons/fa";
import { AuthProviderButton } from "@/components/auth-provider-button";
import { LogInForm } from "@/components/login-form";
import { SignupForm } from "@/components/sign-up-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center max-sm:px-4">
      <Card className="w-full max-w-md border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-gray-900 dark:text-white">
            Welcome to ICTQuest
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="signin">
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-600">
              <TabsTrigger
                className="cursor-pointer text-gray-500 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-gray-800 dark:text-gray-400 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-300 dark:hover:bg-gray-500"
                value="signin"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer text-gray-500 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-gray-800 dark:text-gray-400 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-300 dark:hover:bg-gray-500"
                value="signup"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <LogInForm />
              <Button
                className="mt-2 cursor-pointer p-0 text-indigo-400 hover:text-indigo-300"
                disabled
                variant="link"
              >
                Forgot password?
              </Button>
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
              <br />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex flex-col gap-10">
            <div className="relative">
              <Separator className="absolute top-[50%] bottom-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-400" />
              <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-50 px-4 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                OR
              </span>
            </div>
            <div className="space-y-2">
              <AuthProviderButton
                icon={<FaGoogle />}
                label="Continue with Google"
                provider="google"
              />
              <AuthProviderButton
                disabled
                icon={<FaGithub />}
                label="Continue with Github"
                provider="github"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
