import React from "react";
import { CheckIcon } from "lucide-react";

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <CheckIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
