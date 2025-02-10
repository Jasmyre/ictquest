"use client";

import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

// TODO: Fix Later
// interface UserData {
//   name: string;
//   email: string;
//   [key: string]: number | string;
// }

const ContinueLearningButton = () => {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic")!;
  const router = useRouter()

  // TODO: Fix Later
  // const [data, setData] = useState<UserData | null>(
  //   getLocalStorageItem<UserData>("userData") || null,
  // );

  const handleClick = async () => {
    // TODO: Fix Later
    // console.log(data);
    //
    // if (data) {
    //   console.log(typeof data[topic]);
    //
    //   const updatedData: UserData = { ...data };
    //
    //   if (typeof updatedData[topic] === "number") {
    //     updatedData[topic] = updatedData[topic] + 1;
    //   } else {
    //     updatedData[topic] = 1;
    //   }
    //
    //   setData(updatedData);
    //   setLocalStorageItem("userData", updatedData);
    // } else {
    //   const newData: UserData = {
    //     name: "",
    //     email: "",
    //     [topic]: 1,
    //   };
    //
    //   setData(newData);
    //   setLocalStorageItem("userData", newData);
    // }

    router.push(`/lessons/${topic}#`)
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full place-self-end bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
    >
      Continue Learning
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default ContinueLearningButton;
