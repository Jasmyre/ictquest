"use client";

import { JSX } from "react";

import { htmlAdvancedElements } from "./html_advanced_elements/html-advanced-elements";
import { htmlForm } from "./html_advanced_elements/html-form";
import { htmlContainers } from "./html_elements/html-containers";
import { htmlMediaElements } from "./html_elements/html-media-elements";
import { htmlTypography } from "./html_elements/html-typography";
import { htmlBriefExample } from "./introduction_to_html/html-brief-example";
import { htmlDocumentStructure } from "./introduction_to_html/html-document-structure";
import { htmlIntroduction } from "./introduction_to_html/html-introduction";
import { beyondHTML } from "./html_advanced_elements/beyond-html";

export interface Topic {
  name: string;
  slug: string;
}

export interface LessonContent {
  title: string;
  contents: Array<{
    submit: { label: string };
    content: Array<{
      id: number;
      type: string;
      label:
        | string
        | JSX.Element
        | ((props: { setIsFinished: (value: boolean) => void }) => JSX.Element);
    }>;
  }>;
}

export interface Lesson {
  title: string;
  description: string;
  slug: string;
  topics: Topic[];
  content: Record<string, LessonContent>;
}

export const lessons: Lesson[] = [
  {
    title: "Introduction to HTML",
    description:
      "Introduction to HTML, its History, and HTML Document structure",
    slug: "introduction-to-html",
    topics: [
      { name: "HTML Introduction", slug: "html-introduction" },
      { name: "HTML Brief Examples", slug: "html-brief-examples" },
      { name: "HTML Document Structure", slug: "html-document-structure" },
    ],
    content: {
      "html-introduction": htmlIntroduction,
      "html-brief-examples": htmlBriefExample,
      "html-document-structure": htmlDocumentStructure,
    },
  },

  {
    title: "HTML Elements",
    description: "Learn different HTML elements",
    slug: "html-elements",
    topics: [
      { name: "HTML Typography", slug: "html-typography" },
      { name: "HTML Containers", slug: "html-containers" },
      { name: "HTML Media Elements", slug: "html-media-elements" },
      // { name: "Inputs and Attributes", slug: "inputs-and-attributes" },
    ],
    content: {
      "html-typography": htmlTypography,
      "html-containers": htmlContainers,
      "html-media-elements": htmlMediaElements,
      // "inputs-and-attributes": inputsAndAttributes,
    },
  },

  {
    title: "HTML Advanced Elements",
    description: "Learn more about HTML Advanced Elements",
    slug: "html-advanced-elements",
    topics: [
      { name: "HTML Advanced Elements", slug: "html-advanced-elements" },
      { name: "HTML Form", slug: "html-form" },
      { name: "Beyond HyperText Mark-up Language", slug: "beyond-html" },
    ],
    content: {
      "html-advanced-elements": htmlAdvancedElements,
      "html-form": htmlForm,
      "beyond-html": beyondHTML,
    },
  },

  // {
  //   title: "ABCD",
  //   description: "XY and Z",
  //   slug: "abcd",
  //   topics: [
  //     { name: "Introduction To Html", slug: "intro-to-html" },
  //     { name: "HTML Document Structure9", slug: "html-document-structure9" },
  //   ],
  //   content: {
  //     "intro-to-html": introToHTML,
  //     "html-document-structure9": htmlDocumentStructure9,
  //   },
  // },

  // {
  //   title: "HTML Introduction2",
  //   description:
  //     "Introduction to HTML, its History, and HTML Document Structure.",
  //   slug: "html-introduction",
  //   topics: [
  //     { name: "What is HTML?", slug: "what-is-html2" },
  //     { name: "Text Formatting", slug: "intro-to-html" },
  //   ],
  //   content: {
  //     "what-is-html2": whatIsHTML,
  //   },
  // },
];

export default lessons;
