import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  Book,
  CheckCircle,
  Code,
  Coffee,
  Globe,
  Laptop,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 py-20 text-white dark:from-indigo-900 dark:to-purple-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4 lg:flex-row-reverse">
            <div className="z-10 lg:w-1/2 lg:pr-10">
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                Master HTML with{" "}
                <span className="text-yellow-300 dark:text-yellow-200">
                  ICTQuest
                </span>
              </h1>
              <p className="mb-8 text-xl text-gray-100 sm:text-2xl">
                Unlock your potential in web development with interactive
                lessons that focus on building a strong foundation in HTML.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/lessons">
                  <Button
                    size="lg"
                    className="w-full bg-white text-indigo-600 hover:bg-gray-100 dark:bg-gray-200 dark:text-indigo-800 dark:hover:bg-gray-300 sm:w-auto"
                  >
                    Explore Lessons
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white bg-transparent text-white hover:bg-white hover:text-indigo-600 dark:hover:bg-gray-200 dark:hover:text-indigo-800 sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative mt-10 lg:mt-0 lg:w-1/2">
              <Image
                priority
                src="/"
                alt=""
                width={600}
                height={400}
                className="drop-shadow-2xl"
              />
              <Zap className="absolute right-0 top-0 h-6 w-6 scale-[3.25] text-yellow-200 dark:text-yellow-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Why Choose ICTQuest
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-t-4 border-indigo-500 bg-white transition-shadow duration-300 hover:shadow-lg dark:border-indigo-400 dark:bg-gray-800">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                  <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  Interactive Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Engage with hands-on, interactive HTML lessons designed for
                  optimal learning.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-indigo-500 bg-white transition-shadow duration-300 hover:shadow-lg dark:border-indigo-400 dark:bg-gray-800">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                  <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  Comprehensive Curriculum
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Cover all aspects of HTML, from basics to advanced topics,
                  with structured learning paths.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-indigo-500 bg-white transition-shadow duration-300 hover:shadow-lg dark:border-indigo-400 dark:bg-gray-800">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                  <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  Monitor your learning journey with detailed progress reports
                  and performance analytics.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your HTML Learning Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 h-full w-1 -translate-x-1/2 transform bg-indigo-200 dark:bg-indigo-700"></div>

            <div className="mb-8 flex flex-row-reverse items-center">
              <div className="w-1/2 pr-8 text-right">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  HTML Basics
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start with the fundamentals of HTML structure and syntax.
                </p>
              </div>
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="w-1/2"></div>
            </div>

            <div className="mb-8 flex items-center">
              <div className="w-1/2 pl-8">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Advanced Elements
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Dive deeper into complex HTML elements and attributes.
                </p>
              </div>
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">
                <Laptop className="h-6 w-6 text-white" />
              </div>
              <div className="w-1/2"></div>
            </div>

            <div className="mb-8 flex flex-row-reverse items-center">
              <div className="w-1/2 pr-8 text-right">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Forms & Interactivity
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Master creating interactive web forms and user inputs.
                </p>
              </div>
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="w-1/2"></div>
            </div>

            <div className="mb-8 flex items-center">
              <div className="w-1/2 pl-8">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Semantic HTML
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn to structure your content with meaningful HTML5
                  elements.
                </p>
              </div>
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">
                <Book className="h-6 w-6 text-white" />
              </div>
              <div className="w-1/2"></div>
            </div>

            <div className="mb-8 flex flex-row-reverse items-center">
              <div className="w-1/2 pr-8 text-right">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Accessibility
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ensure your websites are usable by everyone with proper HTML
                  techniques.
                </p>
              </div>
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="w-1/2"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="mb-4 flex items-center">
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  John A.
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Frontend Developer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-600 dark:text-gray-300">
                  “ICTQuest transformed my understanding of web development. The
                  interactive lessons made learning HTML enjoyable and
                  effective.”
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="mb-4 flex items-center">
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Jane A.
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  UX Designer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-600 dark:text-gray-300">
                  “As a designer, understanding HTML was crucial. ICTQuest&apos;s
                  curriculum provided the perfect balance of theory and
                  practical application.”
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="mb-4 flex items-center">
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                  <Star className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  John B.
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Student
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic text-gray-600 dark:text-gray-300">
                  “I started with zero coding knowledge, and now I&apos;m building my
                  own websites. ICTQuest&apos;s step-by-step approach made it
                  possible.”
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 py-20 text-white dark:from-indigo-900 dark:to-purple-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to become an HTML master?
          </h2>
          <p className="mb-10 text-xl text-gray-100">
            Join our learners who have transformed their careers with ICTQuest.
          </p>
          <Link href="/lessons">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 dark:bg-gray-200 dark:text-indigo-800 dark:hover:bg-gray-300"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <Coffee className="animate-float absolute bottom-5 left-10 h-8 w-8 text-indigo-200 dark:text-indigo-300" />
        <Code className="animate-float-delayed absolute right-10 top-5 h-10 w-10 text-indigo-200 dark:text-indigo-300" />
      </section>
    </main>
  );
}
