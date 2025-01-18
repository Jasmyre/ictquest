import { Globe } from "lucide-react";
import { ReactNode } from "react";

interface BrowserProps {
  children: ReactNode;
}
const Browser = ({ children }: BrowserProps) => {
  return (
    <div className="w-full rounded-xl border-gray-200 dark:border-gray-700">
      <header className="flex gap-4 p-2 px-4  border-none bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-600 rounded-[.75rem_.75rem_0_0] text-primary-foreground">
        <Globe />
        <p>Browser</p>
      </header>
      <div className="browser p-2 px-4 py-10 min-h-[20vh] border border-gray-300 dark:border-gray-900 bg-gray-100 text-black rounded-[0_0_.75rem_.75rem]">
        {children}
      </div>
    </div>
  );
};

export default Browser;
