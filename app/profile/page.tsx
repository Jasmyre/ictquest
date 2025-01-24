"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Award, Book, User } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  return (
    <main>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              Your Profile
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-gray-700 dark:text-gray-300"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
                      >
                        Update Profile
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML Basics
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            80%
                          </span>
                        </div>
                        <Progress value={80} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML Elements
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            60%
                          </span>
                        </div>
                        <Progress value={60} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML Forms
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            40%
                          </span>
                        </div>
                        <Progress value={40} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML5 Features
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            20%
                          </span>
                        </div>
                        <Progress value={20} className="w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      <li className="py-4 flex">
                        <Award className="h-6 w-6 text-yellow-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          HTML Basics Mastery
                        </span>
                      </li>
                      <li className="py-4 flex">
                        <Award className="h-6 w-6 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Form Builder
                        </span>
                      </li>
                      <li className="py-4 flex">
                        <Award className="h-6 w-6 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          HTML5 Pioneer
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
