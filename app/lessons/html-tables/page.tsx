import Layout from '../../components/layout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export default function HTMLTablesLesson() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">HTML Tables</h1>
          <div className="space-x-2">
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={16} />
              Previous
            </Button>
            <Button>
              Next
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-600">
              <PlayCircle className="mr-2" size={24} />
              Lesson Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p>HTML tables allow you to arrange data into rows and columns. They&quo;re particularly useful for displaying structured information like spreadsheets, schedules, or any data that benefits from a grid-like layout.</p>
              
              <h2>Basic Table Structure</h2>
              <p>A basic HTML table consists of the following elements:</p>
              <ul>
                <li><code>&lt;table&gt;</code>: Defines the entire table</li>
                <li><code>&lt;tr&gt;</code>: Defines a table row</li>
                <li><code>&lt;th&gt;</code>: Defines a table header cell</li>
                <li><code>&lt;td&gt;</code>: Defines a table data cell</li>
              </ul>

              <h2>Example</h2>
              <pre><code>{`<table>
  <tr>
    <th>Header 1</th>
    <th>Header 2</th>
  </tr>
  <tr>
    <td>Row 1, Cell 1</td>
    <td>Row 1, Cell 2</td>
  </tr>
  <tr>
    <td>Row 2, Cell 1</td>
    <td>Row 2, Cell 2</td>
  </tr>
</table>`}</code></pre>

              <p>This code will create a simple 2x3 table with headers.</p>

              <h2>Styling Tables</h2>
              <p>You can use CSS to style your tables. Some common properties include:</p>
              <ul>
                <li><code>border</code>: Adds borders to the table and cells</li>
                <li><code>padding</code>: Adds space inside cells</li>
                <li><code>text-align</code>: Aligns text within cells</li>
                <li><code>background-color</code>: Changes the background color of cells</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Link href="/lessons">
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={16} />
              Back to Lessons
            </Button>
          </Link>
          <Link href="/quizzes/html-tables">
            <Button>
              Take Quiz
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

