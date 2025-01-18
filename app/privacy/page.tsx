import Layout from '../components/layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">Privacy Policy</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                    ICTQuest Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300">At ICTQuest, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">1. Information We Collect</h2>
                    <p className="text-gray-600 dark:text-gray-300">We collect information you provide directly to us, such as when you create an account, participate in interactive features, or contact us for support. This may include your name, email address, and learning progress.</p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">2. How We Use Your Information</h2>
                    <p className="text-gray-600 dark:text-gray-300">We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your learning experience.</p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">3. Information Sharing and Disclosure</h2>
                    <p className="text-gray-600 dark:text-gray-300">We do not sell or share your personal information with third parties for their direct marketing purposes. We may share your information with service providers who perform services on our behalf.</p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">4. Data Security</h2>
                    <p className="text-gray-600 dark:text-gray-300">We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">5. Contact Us</h2>
                    <p className="text-gray-600 dark:text-gray-300">If you have any questions about this Privacy Policy, please contact us at privacy@ICTQuest.com.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

