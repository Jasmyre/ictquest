import Browser from "@/components/Browser";
import LessonCard from "@/components/LessonCard";

const Index2 = () => {
  return (
    <LessonCard>
      <p>
        Hypertext Markup Language, or HTML, is the computer language that
        structures the web pages on the internet.
      </p>
      <br />
      <p>
        On top of HTML, you can build stunning web pages with buttons, images,
        and lots more.
      </p>
      <br />
      <div className="flex max-md:justify-center">
        <Browser>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-blue-500">Guess the letter</h1>
            <br />
            <h1>C A _</h1>
            <br />
            <div className="flex gap-2">
              <button className="hover:bg-gray-200 py-2 px-2 border">Hello</button>
              <button className="hover:bg-gray-200">Y</button>
              <button className="hover:bg-gray-200">T</button>
            </div>
          </div>
        </Browser>
      </div>
    </LessonCard>
  );
};

export default Index2;
