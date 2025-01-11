import LessonCard from "@/components/LessonCard";
import Image from "next/image";

const Index1 = () => {
  return (
    <LessonCard>
      <p>
        Before you realize it, we&apos;ll be creating real-life projects.
        Let&apos;s start with HTML.
      </p>
      <div className="flex max-md:justify-center">
        <Image
          src={"/mockup/mockup01.png"}
          alt="index1 mockup"
          width={200}
          height={200}
        />
      </div>
    </LessonCard>
  );
};

export default Index1;
