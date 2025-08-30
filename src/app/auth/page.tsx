"use client"

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
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { LogInForm } from "../../components/LogInForm";
import { SignupForm } from '../../components/SignupForm';

export default function AuthPage() {

  const onClick = (provider: string) => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  }

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
                className="mt-2 p-0 text-indigo-400 hover:text-indigo-300"
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
              <Separator className="absolute bottom-[50%] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-400" />
              <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-50 px-4 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                OR
              </span>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="relative flex w-full justify-center border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                onClick={() => onClick("google")}
              >
                <FaGoogle className="absolute bottom-[50%] left-8 top-[50%] translate-x-[-50%] translate-y-[-50%]" />
                <span>Continue with Google</span>
              </Button>
              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    disabled
                    className={cn(
                      "relative flex w-full justify-center border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500",
                    )}
                  >
                    <FaGithub className="absolute bottom-[50%] left-8 top-[50%] translate-x-[-50%] translate-y-[-50%]" />
                    <span>Continue with Github</span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                    <p>Github provider is currently not available.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
              <Button
                variant="outline"
                className="relative flex w-full justify-center border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                onClick={() => onClick("github")}
                disabled
              >
                <FaGithub className="absolute bottom-[50%] left-8 top-[50%] translate-x-[-50%] translate-y-[-50%]" />
                <span>Continue with Github</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
