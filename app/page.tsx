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

export default async function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br rounded-lg from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-950 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse gap-4 items-center">
            <div className="lg:w-1/2 lg:pr-10 z-10">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl mb-6">
                Master HTML with{" "}
                <span className="text-yellow-300 dark:text-yellow-200">
                  ICTQuest
                </span>
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-gray-100">
                Unlock the power of web development through interactive lessons,
                real-world projects, and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/lessons">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-100 dark:bg-gray-200 dark:text-indigo-800 dark:hover:bg-gray-300"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/lessons">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-indigo-600 dark:hover:bg-gray-200 dark:hover:text-indigo-800"
                  >
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 mt-10 lg:mt-0 relative">
              <Image
                priority
                src="/mockup/Frame 11.svg"
                alt="HTML code visualization"
                width={600}
                height={400}
                className="drop-shadow-2xl"
              />
              <Zap className="absolute top-0 right-0 text-yellow-200 dark:text-yellow-300 h-6 w-6 scale-[3.25]" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Why Choose ICTQuest
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              // {
              //   title: "Expert Support",
              //   description:
              //     "Get help from our community of experts and fellow learners whenever you need it.",
              //   icon: Users,
              // },
              // {
              //   title: "Real-world Projects",
              //   description:
              //     "Apply your skills to practical, industry-relevant projects that build your portfolio.",
              //   icon: Laptop,
              // },
              // {
              //   title: "Cutting-edge Content",
              //   description:
              //     "Stay up-to-date with the latest HTML trends and best practices in web development.",
              //   icon: Zap,
              // },
            ].map((feature, index) => (
              <Card
                key={index++}
                className="border-t-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 dark:border-indigo-400"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
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

      {/* Learning Path Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Your HTML Learning Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-indigo-200 dark:bg-indigo-700"></div>
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
                key={index++}
                className={`flex items-center mb-8 ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "pl-8"}`}
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-500 dark:bg-indigo-600 rounded-full flex items-center justify-center z-10">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                key={testimonial.name}
                className="bg-white dark:bg-gray-800"
              >
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i++}
                        className="h-5 w-5 text-yellow-400 dark:text-yellow-300 mr-1"
                      />
                    ))}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="italic text-gray-600 dark:text-gray-300">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-950 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to become an HTML master?
          </h2>
          <p className="text-xl mb-10 text-gray-100">
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
        {/* Floating icons */}
        <Coffee className="absolute bottom-5 left-10 text-indigo-200 dark:text-indigo-300 h-8 w-8 animate-float" />
        <Code className="absolute top-5 right-10 text-indigo-200 dark:text-indigo-300 h-10 w-10 animate-float-delayed" />
      </section>
    </main>
  );
}
