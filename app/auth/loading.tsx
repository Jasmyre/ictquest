import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loading = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center max-sm:px-4">
      <Card className="w-full max-w-md border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            <Loading className="h-[32px] w-[175px]" />
          </CardTitle>

          <CardDescription className="text-gray-500 dark:text-gray-400">
            <Loading className="h-[20px] w-[250px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 gap-2 bg-gray-200 dark:bg-gray-600">
              <TabsTrigger
                value="signin"
                className="text-gray-500 hover:bg-gray-100 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-500 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-gray-300"
                disabled
              ></TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-gray-500 hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-500 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-300"
                disabled
              ></TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-2">
                <div>
                  <div className="space-y-2">
                    <Loading className="h-[20px] w-[50px]" />
                    <Input
                      disabled
                      className="border-gray-500"
                      placeholder=""
                    />
                  </div>
                </div>
                <br />

                <div>
                  <div className="space-y-2">
                    <Loading className="h-[20px] w-[80px]" />
                    <Input
                      disabled
                      className="border-gray-500"
                      placeholder=""
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-400"
                  disabled
                >
                </Button>
              </div>
              <Button
                variant="link"
                className="mt-2 p-0 text-indigo-400 hover:text-indigo-400 dark:text-gray-300"
              >
                <Loading className="h-[20px] w-[125px]" />
              </Button>
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
                disabled
              >
              </Button>
              <Button
                variant="outline"
                className="relative flex w-full justify-center border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                disabled
              >
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default loading;
