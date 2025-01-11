import CodeBlock from "@/components/Code";
import LessonCard from "@/components/LessonCard";
import CodeHighlight from '../../../CodeHighlight';
import ButtonChoice from '../../../ButtonChoice';

const Index3 = () => {
  return (
    <LessonCard>
      <p>
        By adding the HTML code{" "}
        <CodeHighlight>
          &lt;button&gt;Like&lt;/button&gt;
        </CodeHighlight>
        , you can create a button with the label &quot;Like&quot;.
      </p>
      <br />
      <CodeBlock language="HTML">&lt;button&gt;Like&lt;/button&gt;</CodeBlock>
      <br />
      <div className="flex justify-center gap-4">
        <ButtonChoice>
          &lt;/button&gt;
        </ButtonChoice>
        <ButtonChoice>
          &lt;button&gt;
        </ButtonChoice>
        <ButtonChoice>
          like
        </ButtonChoice>
      </div>

    </LessonCard>
  );
};

export default Index3;
