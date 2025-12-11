import { Loader2 } from "lucide-react";
import type { JSX } from "react";

export default function PageLoading(): JSX.Element {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 font-medium text-gray-700 text-lg dark:text-gray-300">
        Loading...
      </span>
    </div>
  );
}
