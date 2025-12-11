import BackButton from "@/components/BackButton";
import { ProgressCard } from "@/components/ProgressCard";

export default function Progress() {
  return (
    <main className="min-h-[80vh]">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              Your Progress
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <ProgressCard />
              <br />
              <div>
                <BackButton>Go Back</BackButton>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
