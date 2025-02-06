"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Book, User } from "lucide-react";
import { useState } from "react";
import { CustomProgress } from '../../components/CustomProgress';

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              Your Profile
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <User className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
                          className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100"
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
                          className="bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                      >
                        Update Profile
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <Book className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML Basics
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            80%
                          </span>
                        </div>
                        <CustomProgress initialValue={0} finalValue={80} />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML Elements
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            60%
                          </span>
                        </div>
                        <CustomProgress initialValue={0} finalValue={60} />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML Forms
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            40%
                          </span>
                        </div>
                        <CustomProgress initialValue={0} finalValue={40} />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            HTML5 Features
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            20%
                          </span>
                        </div>
                        <CustomProgress initialValue={0} finalValue={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      <Award className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          HTML Basics Mastery
                        </span>
                      </li>
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Form Builder
                        </span>
                      </li>
                      <li className="flex py-4">
                        <Award className="mr-2 h-6 w-6 text-yellow-600" />
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
