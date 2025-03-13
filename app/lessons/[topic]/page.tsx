import RenderSubtopics from "./RenderSubtopics";

export default async function TopicPage({
  params,
}: Readonly<{ params: Promise<{ topic: string }> }>) {
  const topic = (await params).topic;

  return (
    
    <RenderSubtopics paramsTopic={topic}/>
  );
}
