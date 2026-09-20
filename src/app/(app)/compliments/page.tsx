import { Suspense } from "react";
import ComplimentsContent from "@/components/pages/compliments/compliments-content";

type Props = {
  searchParams: Promise<{ correct?: string; incorrect?: string }>;
};

const ComplimentsPage = ({ searchParams }: Props) => (
  <main>
    <Suspense fallback={<div>Loading results…</div>}>
      <ComplimentsContent searchParams={searchParams} />
    </Suspense>
  </main>
);

export default ComplimentsPage;
