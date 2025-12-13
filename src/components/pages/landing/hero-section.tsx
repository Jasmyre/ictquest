import { ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import SigninButton from "@/components/signin-button";
import { Button } from "@/components/ui/button";

const HeroSection = async () => (
  <section className="relative overflow-visible rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 py-20 text-white dark:from-indigo-900 dark:to-purple-950">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-4 lg:flex-row-reverse">
        <div className="z-10 lg:w-1/2 lg:pr-10">
          <h1 className="mb-6 font-extrabold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            Master HTML with{" "}
            <span className="text-yellow-300 dark:text-yellow-200">
              ICTQuest
            </span>
          </h1>
          <p className="mb-8 text-gray-100 text-xl sm:text-2xl">
            Unlock your potential in web development with interactive lessons
            that focus on building a strong foundation in HTML.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/lessons">
              <Button
                className="w-full cursor-pointer bg-white text-indigo-600 hover:bg-gray-100 sm:w-auto dark:bg-gray-200 dark:text-indigo-800 dark:hover:bg-gray-300"
                size="lg"
              >
                Explore Lessons
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Suspense
              fallback={
                <Button
                  className="w-full border-white bg-transparent text-white hover:bg-white hover:text-indigo-600 sm:w-auto dark:hover:bg-gray-200 dark:hover:text-indigo-800"
                  disabled
                  size="lg"
                  variant="outline"
                >
                  Sign Out
                </Button>
              }
            >
              <SigninButton />
            </Suspense>
          </div>
        </div>
        <div className="relative mt-10 lg:mt-0 lg:w-1/2">
          <Image
            alt="HTML code visualization"
            className="drop-shadow-2xl"
            height={400}
            priority
            src="/mockup/Frame 11.svg"
            width={600}
          />
          <Zap className="absolute top-0 right-0 h-6 w-6 scale-[3.25] text-yellow-200 dark:text-yellow-300" />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
