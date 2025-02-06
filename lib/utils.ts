import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const wait = (time: number) => {
  return new Promise((res) => setTimeout(res, time));
};

export const getSessionStorageItem = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null; // Return null if not in a browser environment
  const item = window.sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null; // Return parsed item or null if not found
};

export const setSessionStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeSessionStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(key);
  }
};

export const clearSessionStorage = (): void => {
  if (typeof window !== "undefined") {
    window.sessionStorage.clear();
  }
};

export const lessons = {
  "html_basics": 1,
  "html_elements": 1,
  "html_forms": 1,
  "html5_features": 1
}

export const data1 = {
  courseTitle: "HTML Zero to Hero Course",
  subtopics: [
    {
      subtopicTitle: "Introduction to HTML",
      pages: [
        {
          pageNumber: 1,
          title: "What is HTML?",
          content:
            "HTML stands for Hypertext Markup Language. It's the basic building block for creating webpages. In this lesson, you'll learn what HTML is and why it's so important for the web.",
          interactive: [
            {
              type: "multipleChoice",
              question: "What does HTML stand for?",
              options: [
                "HighText Machine Language",
                "HyperText Markup Language",
                "Hyperlink and Text Markup Language",
                "Home Tool Markup Language",
              ],
              answer: "HyperText Markup Language",
            },
          ],
        },
        {
          pageNumber: 2,
          title: "History of HTML",
          content:
            "HTML was created in the early 1990s by Tim Berners-Lee and has evolved a lot since then. This page gives a brief look at its history and why it became so popular.",
          interactive: [
            {
              type: "trueFalse",
              question: "HTML was first released in the early 1990s.",
              answer: "True",
            },
          ],
        },
        {
          pageNumber: 3,
          title: "Basic Structure of an HTML Document",
          content:
            "Every HTML document has a similar structure including a doctype, html tag, head, and body. Here you'll see the skeleton of a webpage.",
          interactive: [
            {
              type: "arrangeCode",
              instruction:
                "Arrange the following lines in the correct order to form a basic HTML document.",
              scrambledCode: [
                "<head>",
                "<body>",
                "<html>",
                "<!DOCTYPE html>",
                "</html>",
                "</head>",
                "</body>",
              ],
              correctOrder: [
                "<!DOCTYPE html>",
                "<html>",
                "<head>",
                "</head>",
                "<body>",
                "</body>",
                "</html>",
              ],
            },
          ],
        },
        {
          pageNumber: 4,
          title: "Doctype Declaration",
          content:
            "The doctype declaration tells the browser which version of HTML is being used. It's usually the very first line in your HTML file.",
          interactive: [
            {
              type: "multipleChoice",
              question: "Where do you place the doctype declaration?",
              options: [
                "At the very beginning of the file",
                "Inside the <html> tag",
                "Inside the <head> tag",
                "At the end of the file",
              ],
              answer: "At the very beginning of the file",
            },
          ],
        },
        {
          pageNumber: 5,
          title: "The HTML Tag",
          content:
            "The <html> tag is the root of an HTML document. Everything you write in HTML should be inside this tag.",
          interactive: [
            {
              type: "fillInTheBlank",
              instruction:
                "Fill in the blank: The ______ tag is the container for the entire HTML document.",
              answer: "html",
            },
          ],
        },
        {
          pageNumber: 6,
          title: "The Head Section",
          content:
            "The head section of an HTML document contains meta information, links to stylesheets, and the title of the document. It doesn't display on the webpage.",
          interactive: [
            {
              type: "trueFalse",
              question:
                "The content inside the <head> tag is displayed on the webpage.",
              answer: "False",
            },
          ],
        },
        {
          pageNumber: 7,
          title: "The Title Tag",
          content:
            "The <title> tag sets the title of your webpage. This title shows up in the browser tab and is important for SEO.",
          interactive: [
            {
              type: "multipleChoice",
              question: "What is the purpose of the <title> tag?",
              options: [
                "To style the page",
                "To display the main heading on the page",
                "To set the title of the webpage for the browser tab",
                "To link to external resources",
              ],
              answer: "To set the title of the webpage for the browser tab",
            },
          ],
        },
        {
          pageNumber: 8,
          title: "The Body Tag",
          content:
            "The <body> tag encloses all the content that will be displayed on the webpage, like text, images, and links.",
          interactive: [
            {
              type: "fillInTheBlank",
              instruction:
                "Fill in the blank: All visible content of a webpage is placed within the <______> tag.",
              answer: "body",
            },
          ],
        },
        {
          pageNumber: 9,
          title: "Headings in HTML",
          content:
            "HTML provides six levels of headings (<h1> to <h6>). <h1> is the most important and <h6> the least. Headings help structure your content.",
          interactive: [
            {
              type: "multipleChoice",
              question:
                "Which heading tag represents the most important heading?",
              options: ["<h6>", "<h1>", "<h3>", "<h5>"],
              answer: "<h1>",
            },
          ],
        },
        {
          pageNumber: 10,
          title: "Paragraphs in HTML",
          content:
            "The <p> tag is used to define paragraphs. It helps in breaking the content into readable blocks.",
          interactive: [
            {
              type: "trueFalse",
              question: "The <p> tag is used for paragraphs in HTML.",
              answer: "True",
            },
          ],
        },
        {
          pageNumber: 11,
          title: "Links and Anchor Tags",
          content:
            "The <a> tag is used to create hyperlinks. It allows users to click and go to other pages or websites.",
          interactive: [
            {
              type: "multipleChoice",
              question: "Which attribute in the <a> tag specifies the URL?",
              options: ["href", "src", "link", "url"],
              answer: "href",
            },
          ],
        },
        {
          pageNumber: 12,
          title: "Images in HTML",
          content:
            "The <img> tag embeds images into your webpage. It needs a 'src' attribute for the image path and an 'alt' attribute for accessibility.",
          interactive: [
            {
              type: "fillInTheBlank",
              instruction:
                "Fill in the blank: The attribute used to provide alternative text for images is called ______.",
              answer: "alt",
            },
          ],
        },
        {
          pageNumber: 13,
          title: "Lists: Ordered and Unordered",
          content:
            "HTML has two types of lists: ordered lists (<ol>) and unordered lists (<ul>). Each list uses the <li> tag for individual items.",
          interactive: [
            {
              type: "arrangeCode",
              instruction:
                "Arrange the following tags to form a simple unordered list.",
              scrambledCode: [
                "<li>Item 1</li>",
                "<ul>",
                "</ul>",
                "<li>Item 2</li>",
              ],
              correctOrder: [
                "<ul>",
                "<li>Item 1</li>",
                "<li>Item 2</li>",
                "</ul>",
              ],
            },
          ],
        },
        {
          pageNumber: 14,
          title: "Div and Span Elements",
          content:
            "The <div> and <span> tags are used as containers. <div> is a block-level element and <span> is inline. They're great for grouping and styling.",
          interactive: [
            {
              type: "trueFalse",
              question: "The <span> tag is a block-level element.",
              answer: "False",
            },
          ],
        },
        {
          pageNumber: 15,
          title: "Attributes in HTML",
          content:
            "Attributes add extra info to HTML elements. Common ones are 'class', 'id', and 'style'. They help with styling and scripting.",
          interactive: [
            {
              type: "multipleChoice",
              question:
                "Which attribute is typically used to assign a unique identifier to an element?",
              options: ["class", "id", "style", "src"],
              answer: "id",
            },
          ],
        },
        {
          pageNumber: 16,
          title: "Meta Tags and SEO",
          content:
            "Meta tags in the <head> section provide metadata about the HTML document. They're crucial for SEO and ensuring your page is mobile-friendly.",
          interactive: [
            {
              type: "multipleChoice",
              question: "Where are meta tags placed in an HTML document?",
              options: [
                "Inside the <body> tag",
                "Inside the <footer> tag",
                "Inside the <head> tag",
                "Before the <!DOCTYPE html> declaration",
              ],
              answer: "Inside the <head> tag",
            },
          ],
        },
        {
          pageNumber: 17,
          title: "Introduction to HTML Entities",
          content:
            "HTML entities let you display reserved characters in HTML. For example, use &amp;lt; for <, &amp;gt; for >, and &amp;amp; for &amp;.",
          interactive: [
            {
              type: "fillInTheBlank",
              instruction:
                "Fill in the blank: To display a less-than sign, you use the entity ______.",
              answer: "&lt;",
            },
          ],
        },
        {
          pageNumber: 18,
          title: "Comments in HTML",
          content:
            "Comments in HTML start with <!-- and end with -->. They are notes for developers and do not show up on the webpage.",
          interactive: [
            {
              type: "trueFalse",
              question: "HTML comments are visible on the webpage.",
              answer: "False",
            },
          ],
        },
        {
          pageNumber: 19,
          title: "Best Practices in Writing HTML",
          content:
            "Good HTML code is clean, well-indented, and semantic. Using the right tags for the right content improves readability and SEO.",
          interactive: [
            {
              type: "multipleChoice",
              question: "Which of these is a best practice when writing HTML?",
              options: [
                "Using deprecated tags",
                "Mixing HTML and CSS inline excessively",
                "Using semantic tags and proper indentation",
                "Ignoring accessibility standards",
              ],
              answer: "Using semantic tags and proper indentation",
            },
          ],
        },
        {
          pageNumber: 20,
          title: "Summary and Next Steps",
          content:
            "You've learned the basics of HTML in this introduction. Next up, explore CSS for styling and JavaScript for interactivity. Great job so far!",
          interactive: [
            {
              type: "quiz",
              instruction:
                "Answer the following questions to review what you've learned.",
              questions: [
                {
                  type: "multipleChoice",
                  question:
                    "What tag encloses all visible content on a webpage?",
                  options: ["<html>", "<body>", "<head>", "<div>"],
                  answer: "<body>",
                },
                {
                  type: "trueFalse",
                  question:
                    "Meta tags are placed in the body section of an HTML document.",
                  answer: "False",
                },
                {
                  type: "fillInTheBlank",
                  instruction:
                    "Fill in the blank: HTML stands for Hypertext ______ Markup Language.",
                  answer: "Markup",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
 

export const data = {
  name: "developer",
  email: "example@email.com",
  progress: {
    "html_basics": [1,2,3,4,].length
  }
}