import { Loader2 } from "lucide-react";

export default function PageLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
      <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">
        Loading...
      </span>
    </div>
  );
}
