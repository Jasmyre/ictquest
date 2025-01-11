import Layout from '../../components/layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HTMLTablesQuiz() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">HTML Tables Quiz</h1>
          <Link href="/lessons/html-tables">
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={16} />
              Back to Lesson
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-purple-600">
              <CheckCircle className="mr-2" size={24} />
              Test Your Knowledge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">1. Which HTML tag is used to define a table row?</h2>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a" id="q1-a" />
                    <Label htmlFor="q1-a">&lt;td&gt;</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="q1-b" />
                    <Label htmlFor="q1-b">&lt;tr&gt;</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="c" id="q1-c" />
                    <Label htmlFor="q1-c">&lt;th&gt;</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="d" id="q1-d" />
                    <Label htmlFor="q1-d">&lt;table&gt;</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">2. Which tag is used for table headers?</h2>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a" id="q2-a" />
                    <Label htmlFor="q2-a">&lt;thead&gt;</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="q2-b" />
                    <Label htmlFor="q2-b">&lt;header&gt;</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="c" id="q2-c" />
                    <Label htmlFor="q2-c">&lt;th&gt;</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="d" id="q2-d" />
                    <Label htmlFor="q2-d">&lt;td&gt;</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">3. Which CSS property is used to add space inside table cells?</h2>
                <RadioGroup>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a" id="q3-a" />
                    <Label htmlFor="q3-a">margin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="b" id="q3-b" />
                    <Label htmlFor="q3-b">padding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="c" id="q3-c" />
                    <Label htmlFor="q3-c">border-spacing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="d" id="q3-d" />
                    <Label htmlFor="q3-d">cell-spacing</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full">
                Submit Quiz
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

