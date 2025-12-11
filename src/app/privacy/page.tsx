import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-bold text-3xl text-gray-900 leading-tight dark:text-gray-100">
              Privacy Policy
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center font-semibold text-2xl text-gray-900 dark:text-gray-100">
                    <Shield className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    ICTQuest Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300">
                      At ICTQuest, we are committed to protecting your privacy.
                      This Privacy Policy explains how we collect, use, and
                      safeguard your personal information.
                    </p>

                    <h2 className="mt-6 mb-3 font-semibold text-gray-900 text-xl dark:text-gray-100">
                      1. Information We Collect
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      We collect information you provide directly to us, such as
                      when you create an account, participate in interactive
                      features, or contact us for support. This may include your
                      name, email address, and learning progress.
                    </p>

                    <h2 className="mt-6 mb-3 font-semibold text-gray-900 text-xl dark:text-gray-100">
                      2. Account Registration and Login
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      When you create an account or log in to ICTQuest, we
                      collect and store information such as your email address
                      and authentication details. This allows us to provide
                      personalized learning experiences, track progress, and
                      enhance account security.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      We may use third-party authentication services (such as
                      Google or GitHub) to facilitate account creation and
                      login. By using these services, you agree to their
                      respective privacy policies.
                    </p>

                    <h2 className="mt-6 mb-3 font-semibold text-gray-900 text-xl dark:text-gray-100">
                      3. How We Use Your Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      We use the information we collect to provide, maintain,
                      and improve our services, to communicate with you, and to
                      personalize your learning experience.
                    </p>

                    <h2 className="mt-6 mb-3 font-semibold text-gray-900 text-xl dark:text-gray-100">
                      4. Information Sharing and Disclosure
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      We do not sell or share your personal information with
                      third parties for their direct marketing purposes. We may
                      share your information with service providers who perform
                      services on our behalf.
                    </p>

                    <h2 className="mt-6 mb-3 font-semibold text-gray-900 text-xl dark:text-gray-100">
                      5. Data Security
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      We take reasonable measures to help protect your personal
                      information from loss, theft, misuse, and unauthorized
                      access, disclosure, alteration, and destruction.
                    </p>

                    <h2 className="mt-6 mb-3 font-semibold text-gray-900 text-xl dark:text-gray-100">
                      6. Contact Us
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      If you have any questions about this Privacy Policy,
                      please contact us at privacy@ICTQuest.com.
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
