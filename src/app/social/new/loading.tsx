// import { baseUrl } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const revalidate = 60;

async function Loading() {
  return (
    <div className="min-h-[80vh] py-10">
      <header className="mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-white">
                Community
              </h1>
              <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
                Connect with fellow learners
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
                <Input
                  className="w-full border-gray-200 bg-white pl-9 focus-visible:ring-indigo-600 dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Search Users..."
                  //   value={searchQuery}
                  //   onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs className="w-full" defaultValue="all">
            <TabsList className="mx-auto mb-8 w-full max-w-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                value="all"
              >
                All Users
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                value="following"
              >
                Following
              </TabsTrigger>
            </TabsList>
            <TabsContent className="mt-0" value="all">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                Loading
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default Loading;
