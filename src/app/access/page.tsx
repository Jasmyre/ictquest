"use client";

import { Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/utils";

const Page = () => {
  const [isAutoSkipEnabled, setIsAutoSkipEnabled] = useState<boolean>(
    !!getLocalStorageItem("skip")
  );

  const handleAutoSkip = async () => {
    if (isAutoSkipEnabled) {
      removeLocalStorageItem("skip");
      setIsAutoSkipEnabled((prev) => !prev);
    } else {
      setLocalStorageItem("skip", true);
      setIsAutoSkipEnabled((prev) => !prev);
    }
  };

  return (
    <main>
      <div className="min-h-[80vh] py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              ACCESS ROLE
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
                    <Eye className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <p>
                      This page is for development and debugging purposes only.
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Button onClick={handleAutoSkip}>
                      {isAutoSkipEnabled
                        ? "Disable auto skip"
                        : "Enable auto skip"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
};

export default Page;
