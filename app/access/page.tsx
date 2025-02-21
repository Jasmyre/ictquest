import LessonCard from '@/components/LessonCard';
import { SkipAccess } from './SkipAccess';

export default function page() {
  return (
    <main className="min-h-[75vh]">
        {/* <Input className="bg-gray-900 border-gray-700 shadow-none" placeholder="Search" /> */}
        <br />
        <LessonCard>
          <h1 className="text-3xl">ROLE ACCESS</h1>
            <p className="mt-2">
              Ths page is primarily used for development and debugging purposes only! please use with caution.
            </p>
            <br />
            <SkipAccess />
        </LessonCard>
    </main>
  )
}
