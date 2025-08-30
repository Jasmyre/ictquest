import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";

const page = () => {
  return (
    <main className="flex min-h-[80vh] items-center justify-center">
      <Card className="h-max w-max border-gray-200 bg-white text-center dark:border-gray-700 dark:bg-gray-800">
        <CardHeader></CardHeader>
        <CardContent className="text-gray-900 dark:text-gray-200">
          <h1 className="text-3xl font-bold text-destructive">Maintenance</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">The website is currently in maintenance, please comeback later.</p>
        </CardContent>
      </Card>
    </main>
  );
};

export default page;
