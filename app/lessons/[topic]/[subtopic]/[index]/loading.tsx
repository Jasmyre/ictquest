import Layout from "@/app/components/layout";
import { CustomProgress } from "@/components/CustomProgress";
import LessonCard from "@/components/LessonCard";
import Loading from "@/components/Loading";

const loading = async () => {
  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Loading className="w-[325px] h-[16px] rounded-md" />
            <br />
            <CustomProgress initialValue={0} finalValue={0} delay={0} />
          </div>
        </header>
        <main className="mt-10">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <LessonCard>
              <div className="flex flex-col justify-between min-h-[65vh]">
                <div className="prose dark:prose-invert max-w-none">
                  <Loading className="w-[100%] h-[16px] rounded-md bg-gray-300 dark:bg-gray-700 " />
                  <br />
                  <Loading className="w-[100%] h-[16px] rounded-md bg-gray-300 dark:bg-gray-700" />
                  <br />
                  <Loading className="w-[98%] h-[16px] rounded-md bg-gray-300 dark:bg-gray-700" />
                  <br />
                  <Loading className="w-[95%] h-[16px] rounded-md bg-gray-300 dark:bg-gray-700" />
                  <br />
                  <Loading className="w-[66%] h-[16px] rounded-md bg-gray-300 dark:bg-gray-700" />
                  <br />
                  <Loading className="w-[100%] h-[25vh] rounded-md bg-gray-300 dark:bg-gray-700" />
                  <br />
                </div>
                <br />
                
              </div>
            </LessonCard>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default loading;
