import { Loader2 } from "lucide-react";

export default function PageLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">
        Loading...
      </span>
    </div>
  );
}
