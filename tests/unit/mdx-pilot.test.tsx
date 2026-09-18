// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { lessons } from "@/db/lessons";
import {
  checkSlugParity,
  getLegacyProgressKeys,
  PILOT,
  parseLessonFrontmatter,
} from "@/lib/lessons/mdx";

const PILOT_MDX = path.resolve(
  __dirname,
  "../../content/lessons/introduction-to-html/html_introduction.mdx"
);

const LESSON_MODEL_RE = /model\s+Lesson\s*\{/;
const TOPIC_MODEL_RE = /model\s+Topic\s*\{/;
const CONTINUE_BUTTON_RE = /Continue/;
const ADVANCE_BUTTON_RE = /Continue|Finish/;
const CLOSING_TEXT_RE = /that's a wrap/;
const PRACTICE_TITLE_RE = /creating a button/;

function readPilot(): string {
  return fs.readFileSync(PILOT_MDX, "utf8");
}

describe("MDX pilot slice (migration 06)", () => {
  it("pilot lesson lives in the content collection with full frontmatter", () => {
    expect(fs.existsSync(PILOT_MDX)).toBe(true);
    const fm = parseLessonFrontmatter(readPilot());
    expect(fm.lesson).toBe(PILOT.lesson);
    expect(fm.subtopic).toBe(PILOT.subtopic);
    expect(fm.slug).toBe(PILOT.slug);
    expect(fm.title).toBeTruthy();
    expect(fm.order).toBe(1);
  });

  it("pilot slugs keep parity with existing progress keys", () => {
    const fm = parseLessonFrontmatter(readPilot());
    const legacy = lessons.map((l) => ({
      lesson: l.slug,
      subtopics: Object.keys(l.content),
    }));
    // Progress keys are { topic: lesson.slug, subtopic: content key };
    // the MDX slug must equal the legacy subtopic key so stored keys still match.
    const report = checkSlugParity([fm], legacy);
    expect(report.missing).toEqual([]);
    expect(report.ok).toBe(true);

    const keys = getLegacyProgressKeys(lessons);
    expect(keys).toContainEqual({
      topic: fm.lesson,
      subtopic: fm.subtopic,
    });
  });

  it("central component map exposes the pilot block components", async () => {
    const map = await import("@/components/lessons/mdx-components");
    const expected = [
      "CodeBlock",
      "CodeHighlight",
      "Browser",
      "Image",
      "PracticeQuiz",
      "MultipleChoiceQuiz",
      "Step",
    ] as const;
    for (const key of expected) {
      expect(map.lessonComponents[key], key).toBeTruthy();
    }
  });

  it("MultipleChoiceQuiz records correctness through stepper callbacks", async () => {
    const map = await import("@/components/lessons/mdx-components");
    const setIsFinished = vi.fn();
    const setNumberOfCorrect = vi.fn((fn: (n: number) => number) => fn(0));
    const setNumberOfInCorrect = vi.fn((fn: (n: number) => number) => fn(0));

    render(
      <map.MultipleChoiceQuiz
        answer="<br>"
        options={["<br>", "<hr>", "<p>", "<span>"]}
        response={{ positive: "That's right!", negative: "Not quite." }}
        setIsFinishedAction={setIsFinished}
        setNumberOfCorrectAction={setNumberOfCorrect}
        setNumberOfInCorrectAction={setNumberOfInCorrect}
        title={["Which tag is used to insert a line break?"]}
      />
    );

    // Every option renders (shuffle-free kind renders all options verbatim).
    for (const opt of ["<br>", "<hr>", "<p>", "<span>"]) {
      expect(screen.getByRole("button", { name: opt })).toBeDefined();
    }

    fireEvent.click(screen.getByRole("button", { name: "<br>" }));
    expect(setNumberOfCorrect).toHaveBeenCalled();
    expect(setIsFinished).toHaveBeenCalledWith(true);
    expect(await screen.findByText("That's right!")).toBeDefined();
  });

  it("PracticeQuiz shuffles inside the component and records correctness", async () => {
    const map = await import("@/components/lessons/mdx-components");
    const setIsFinished = vi.fn();
    const setNumberOfCorrect = vi.fn((fn: (n: number) => number) => fn(0));
    const setNumberOfInCorrect = vi.fn((fn: (n: number) => number) => fn(0));

    const { container } = render(
      <map.PracticeQuiz
        answer="<button>Click me!</button>"
        options={[
          { label: "<button>", priority: 1 },
          { label: "Click me!", priority: 2 },
          { label: "</button>", priority: 3 },
        ]}
        response={{ positive: "Correct!", negative: "Try again!" }}
        setIsFinishedAction={setIsFinished}
        setNumberOfCorrectAction={setNumberOfCorrect}
        setNumberOfInCorrectAction={setNumberOfInCorrect}
        title={["Build the button."]}
      />
    );

    // No shuffledData prop needed: shuffle lives inside the component.
    // All options render regardless of shuffled order.
    const buttons = Array.from(container.querySelectorAll("button"));
    const byText = (t: string) =>
      buttons.find((b) => b.textContent?.includes(t));
    for (const opt of ["<button>", "Click me!", "</button>"]) {
      expect(byText(opt), `option ${opt}`).toBeDefined();
    }

    // Answer in priority order.
    fireEvent.click(byText("<button>") as HTMLButtonElement);
    fireEvent.click(byText("Click me!") as HTMLButtonElement);
    fireEvent.click(byText("</button>") as HTMLButtonElement);

    expect(setNumberOfCorrect).toHaveBeenCalled();
    expect(setIsFinished).toHaveBeenCalledWith(true);
    expect(await screen.findByText("Correct!")).toBeDefined();
  });

  it("persistence holds progress metadata only (no lesson tables)", () => {
    const schema = fs.readFileSync(
      path.resolve(__dirname, "../../prisma/schema.prisma"),
      "utf8"
    );
    expect(schema).toContain("model ProgressData {");
    expect(schema).not.toMatch(LESSON_MODEL_RE);
    expect(schema).not.toMatch(TOPIC_MODEL_RE);
  });

  it("pilot stepper walks Subtopic-Steps and gates Next on quizzes", async () => {
    const { PilotLesson } = await import("@/components/lessons/pilot-lesson");
    render(<PilotLesson />);
    expect(
      await screen.findByText("What is HTML and Its History")
    ).toBeDefined();
    // First step is prose with a Continue submit.
    expect(
      screen.getByRole("button", { name: CONTINUE_BUTTON_RE })
    ).toBeDefined();
  });

  it("learner journeys the full pilot: prose, code, demo, both quiz kinds", async () => {
    const { PilotLesson } = await import("@/components/lessons/pilot-lesson");
    const { container } = render(<PilotLesson />);
    const advance = () =>
      screen.getByRole("button", { name: ADVANCE_BUTTON_RE });

    // Steps 1-4: welcome, skeleton prose, code block, browser demo.
    expect(
      await screen.findByText("What is HTML and Its History")
    ).toBeDefined();
    fireEvent.click(advance());
    fireEvent.click(advance());
    fireEvent.click(advance());
    expect(
      await screen.findByText("The same snippet live in the browser:")
    ).toBeDefined();

    // Step 5: ordering quiz gates Next until solved.
    fireEvent.click(advance());
    expect(await screen.findByText(PRACTICE_TITLE_RE)).toBeDefined();
    expect(advance()).toBeDisabled();
    const buttons = () => Array.from(container.querySelectorAll("button"));
    const byText = (t: string) =>
      buttons().find((b) => b.textContent?.includes(t));
    fireEvent.click(byText("<button>") as HTMLButtonElement);
    fireEvent.click(byText("Click me!") as HTMLButtonElement);
    fireEvent.click(byText("</button>") as HTMLButtonElement);
    expect(
      await screen.findByText("Correct, you are a fast learner!")
    ).toBeDefined();
    expect(advance()).not.toBeDisabled();

    // Step 6: multiple-choice quiz records correctness.
    fireEvent.click(advance());
    fireEvent.click(
      screen.getByRole("button", { name: "HyperText Markup Language" })
    );
    expect(await screen.findByText("Yup, you got it!")).toBeDefined();

    // Step 7: closing prose.
    fireEvent.click(advance());
    expect(await screen.findByText(CLOSING_TEXT_RE)).toBeDefined();
  });
});
