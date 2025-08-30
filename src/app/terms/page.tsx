import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <main>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
              Terms of Use
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    <ScrollText className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                    ICTQuest Terms of Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300">
                      Welcome to ICTQuest. By using our website and services,
                      you agree to comply with and be bound by the following
                      terms and conditions:
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      1. Acceptance of Terms
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      By accessing or using ICTQuest, you agree to be bound by
                      these Terms of Use and all applicable laws and
                      regulations. If you do not agree with any part of these
                      terms, you may not use our services.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      2. Use of Service
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      You may use ICTQuest for your personal, non-commercial use
                      only. You must not use ICTQuest for any illegal or
                      unauthorized purpose.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      3. User Account
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      To access certain features of ICTQuest, you may be
                      required to create an account. You are responsible for
                      maintaining the confidentiality of your account and
                      password.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      4. Intellectual Property
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      The content on ICTQuest, including text, graphics, logos,
                      and software, is the property of ICTQuest or its content
                      suppliers and is protected by copyright and other
                      intellectual property laws.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      5. Limitation of Liability
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      ICTQuest shall not be liable for any indirect, incidental,
                      special, consequential or punitive damages, or any loss of
                      profits or revenues, whether incurred directly or
                      indirectly, or any loss of data, use, goodwill, or other
                      intangible losses.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      6. Changes to Terms
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      ICTQuest reserves the right to modify or replace these
                      Terms of Use at any time. It is your responsibility to
                      check these Terms periodically for changes.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                      7. Contact Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      If you have any questions about these Terms, please
                      contact us at terms@ICTQuest.com.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </main>
  );
}
