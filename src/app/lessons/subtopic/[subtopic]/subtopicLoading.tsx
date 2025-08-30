import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import Loading from "@/components/Loading";

const loading = async () => {
  return (
    <main>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Loading className="h-[16px] rounded-md sm:w-[325px]" />
            <br />
            <CustomProgress initialValue={0} finalValue={0} delay={0} />
          </div>
        </header>
        <main className="mt-10">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <LessonCard>
              <div className="flex min-h-[65vh] flex-col justify-between">
                <div className="prose dark:prose-invert max-w-none">
                  <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[100%] dark:bg-gray-700" />
                  <br />
                  <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[100%] dark:bg-gray-700" />
                  <br />
                  <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[98%] dark:bg-gray-700" />
                  <br />
                  <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[95%] dark:bg-gray-700" />
                  <br />
                  <Loading className="h-[16px] rounded-md bg-gray-300 sm:w-[66%] dark:bg-gray-700" />
                  <br />
                  <Loading className="h-[25vh] rounded-md bg-gray-300 sm:w-[100%] dark:bg-gray-700" />
                  <br />
                </div>
                <br />
              </div>
            </LessonCard>
          </div>
        </main>
      </div>
    </main>
  );
};

export default loading;
