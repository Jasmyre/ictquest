import RenderSubtopics from "./RenderSubtopics";

export default async function TopicPage({
  params,
}: Readonly<{ params: Promise<{ topic: string }> }>) {
  const topic = (await params).topic;

  return <RenderRenderer topic={topic} />;
}

const RenderRenderer = async ({ topic }: { topic: string }) => {
  "use cache";

  return <RenderSubtopics paramsTopic={topic} />;
};
