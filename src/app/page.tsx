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
} from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/pages/landing/hero-section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LandingPage() {
  return (
    <main>
      <HeroSection />
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl text-gray-900 dark:text-gray-100">
            Why Choose ICTQuest
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Interactive Lessons",
                description:
                  "Engage with hands-on, interactive HTML lessons designed for optimal learning.",
                icon: Book,
              },
              {
                title: "Comprehensive Curriculum",
                description:
                  "Cover all aspects of HTML, from basics to advanced topics, with structured learning paths.",
                icon: CheckCircle,
              },
              {
                title: "Progress Tracking",
                description:
                  "Monitor your learning journey with detailed progress reports and performance analytics.",
                icon: Award,
              },
            ].map((feature, index) => (
              <Card
                className="border-indigo-500 border-t-4 bg-white transition-shadow duration-300 hover:shadow-lg dark:border-indigo-400 dark:bg-gray-800"
                key={index}
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
                    <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <CardTitle className="text-gray-900 text-xl dark:text-gray-100">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-20 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl text-gray-900 dark:text-gray-100">
            Your HTML Learning Journey
          </h2>
          <div className="relative">
            <div className="-translate-x-1/2 absolute left-1/2 h-full w-1 transform bg-indigo-200 dark:bg-indigo-700" />
            {[
              {
                title: "HTML Basics",
                description:
                  "Start with the fundamentals of HTML structure and syntax.",
                icon: Code,
              },
              {
                title: "Advanced Elements",
                description:
                  "Dive deeper into complex HTML elements and attributes.",
                icon: Laptop,
              },
              {
                title: "Forms & Interactivity",
                description:
                  "Master creating interactive web forms and user inputs.",
                icon: Users,
              },
              {
                title: "Semantic HTML",
                description:
                  "Learn to structure your content with meaningful HTML5 elements.",
                icon: Book,
              },
              {
                title: "Accessibility",
                description:
                  "Ensure your websites are usable by everyone with proper HTML techniques.",
                icon: Globe,
              },
            ].map((step, index) => (
              <div
                className={`mb-8 flex items-center ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                key={index}
              >
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}
                >
                  <h3 className="mb-2 font-semibold text-gray-900 text-xl dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-bold text-3xl text-gray-900 dark:text-gray-100">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "John A.",
                role: "Frontend Developer",
                quote:
                  "ICTQuest transformed my understanding of web development. The interactive lessons made learning HTML enjoyable and effective.",
              },
              {
                name: "Jane A.",
                role: "UX Designer",
                quote:
                  "As a designer, understanding HTML was crucial. ICTQuest's curriculum provided the perfect balance of theory and practical application.",
              },
              {
                name: "John B.",
                role: "Student",
                quote:
                  "I started with zero coding knowledge, and now I'm building my own websites. ICTQuest's step-by-step approach made it possible.",
              },
            ].map((testimonial) => (
              <Card
                className="bg-white dark:bg-gray-800"
                key={testimonial.name}
              >
                <CardHeader>
                  <div className="mb-4 flex items-center">
                    {[...new Array(5)].map((_, i) => (
                      <Star
                        className="mr-1 h-5 w-5 text-yellow-400 dark:text-yellow-300"
                        key={i}
                      />
                    ))}
                  </div>
                  <CardTitle className="font-semibold text-gray-900 text-lg dark:text-gray-100">
                    {testimonial.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic dark:text-gray-300">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 py-20 text-white dark:from-indigo-900 dark:to-purple-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 font-bold text-3xl">
            Ready to become an HTML master?
          </h2>
          <p className="mb-10 text-gray-100 text-xl">
            Join our learners who have transformed their careers with ICTQuest.
          </p>
          <Link href="/lessons">
            <Button
              className="bg-white text-indigo-600 hover:bg-gray-100 dark:bg-gray-200 dark:text-indigo-800 dark:hover:bg-gray-300"
              size="lg"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <Coffee className="absolute bottom-5 left-10 h-8 w-8 animate-float text-indigo-200 dark:text-indigo-300" />
        <Code className="absolute top-5 right-10 h-10 w-10 animate-float-delayed text-indigo-200 dark:text-indigo-300" />
      </section>
    </main>
  );
}
