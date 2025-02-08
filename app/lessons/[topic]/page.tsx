import RenderSubtopics from "./RenderSubtopics";

// TODO: Delete later
// const topics = {
//   "html-basics": {
//     title: "HTML Basics",
//     description: "Learn the fundamentals of HTML",
//     subtopics: [
//       { name: "Introduction to HTML", slug: "intro-to-html" },
//       { name: "HTML Document Structure", slug: "html-document-structure" },
//       { name: "Text Formatting", slug: "intro-to-html" },
//     ],
//   },
//   "html-elements": {
//     title: "HTML Elements",
//     description: "Explore common HTML elements",
//     subtopics: [
//       { name: "Links and Anchors", slug: "intro-to-html" },
//       { name: "Images and Multimedia", slug: "intro-to-html" },
//       { name: "Lists and Tables", slug: "intro-to-html" },
//     ],
//   },
//   "html-forms": {
//     title: "HTML Forms",
//     description: "Master creating interactive forms",
//     subtopics: [
//       { name: "Form Basics", slug: "intro-to-html" },
//       { name: "Input Types", slug: "intro-to-html" },
//       { name: "Form Validation", slug: "intro-to-html" },
//     ],
//   },
//   "html5-features": {
//     title: "HTML5 Features",
//     description: "Discover new HTML5 elements and APIs",
//     subtopics: [
//       { name: "Semantic Elements", slug: "intro-to-html" },
//       { name: "Audio and Video", slug: "intro-to-html" },
//       { name: "Canvas and SVG", slug: "intro-to-html" },
//     ],
//   },
// };

export default async function TopicPage({
  params,
}: Readonly<{ params: Promise<{ topic: string }> }>) {
  const topic = (await params).topic;

  return <RenderSubtopics paramsTopic={topic} />;
}
