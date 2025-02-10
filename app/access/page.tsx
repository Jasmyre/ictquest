import LessonCard from '@/components/LessonCard';
import { Input } from '@/components/ui/input';

export default function page() {
  return (
    <main className="min-h-[75vh]">
        <Input className="bg-gray-900 border-gray-700 shadow-none" placeholder="Search" />
        <br />
        <LessonCard>
            Not Available yet
        </LessonCard>
    </main>
  )
}
