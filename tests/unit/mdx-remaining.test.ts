import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lessons } from "@/db/lessons";
import {
  checkSlugParity,
  getLegacyProgressKeys,
  parseLessonFrontmatter,
} from "@/lib/lessons/mdx";

const CONTENT_DIR = path.resolve(__dirname, "../../content/lessons");
const ROOT = path.resolve(__dirname, "../..");
const FRONTMATTER_STRIP_RE = /^---[\s\S]*?---/;
const TAG_RE = /<([A-Z][A-Za-z]*)/g;
const USE_CACHE_RE = /"use cache"|'use cache'/;
const CACHE_LIFE_HOURS_RE = /cacheLife\(\s*["']hours["']\s*\)/;

/** Full collection: pilot (order 1) + remaining migration (#32). */
const EXPECTED = [
  {
    file: "introduction-to-html/html_introduction.mdx",
    lesson: "introduction-to-html",
    subtopic: "html_introduction",
    order: 1,
  },
  {
    file: "introduction-to-html/html_brief_examples.mdx",
    lesson: "introduction-to-html",
    subtopic: "html_brief_examples",
    order: 2,
  },
  {
    file: "introduction-to-html/html_document_structure.mdx",
    lesson: "introduction-to-html",
    subtopic: "html_document_structure",
    order: 3,
  },
  {
    file: "html-elements/html_typography.mdx",
    lesson: "html-elements",
    subtopic: "html_typography",
    order: 1,
  },
  {
    file: "html-elements/html_containers.mdx",
    lesson: "html-elements",
    subtopic: "html_containers",
    order: 2,
  },
  {
    file: "html-elements/html_media_elements.mdx",
    lesson: "html-elements",
    subtopic: "html_media_elements",
    order: 3,
  },
  {
    file: "advanced-html/html_advanced_elements.mdx",
    lesson: "advanced-html",
    subtopic: "html_advanced_elements",
    order: 1,
  },
  {
    file: "advanced-html/html_form.mdx",
    lesson: "advanced-html",
    subtopic: "html_form",
    order: 2,
  },
  {
    file: "advanced-html/beyond_html.mdx",
    lesson: "advanced-html",
    subtopic: "beyond_html",
    order: 3,
  },
  { file: "test/quiz.mdx", lesson: "test", subtopic: "quiz", order: 1 },
] as const;

function readMdx(rel: string): string {
  return fs.readFileSync(path.join(CONTENT_DIR, rel), "utf8");
}

describe("MDX remaining lessons (migration 09, #32)", () => {
  it("every legacy lesson reads from the new collection with identical slugs and order", () => {
    // One MDX file per legacy progress key: progress resumes unchanged.
    expect(EXPECTED.length).toBe(getLegacyProgressKeys(lessons).length);
    for (const e of EXPECTED) {
      const full = path.join(CONTENT_DIR, e.file);
      expect(fs.existsSync(full), `missing MDX: ${e.file}`).toBe(true);
      const fm = parseLessonFrontmatter(readMdx(e.file));
      expect(fm.lesson).toBe(e.lesson);
      expect(fm.subtopic).toBe(e.subtopic);
      // Slug stays stable so existing ProgressData keys still match.
      expect(fm.slug).toBe(e.subtopic);
      expect(fm.order).toBe(e.order);
      expect(fm.title.trim().length).toBeGreaterThan(0);
    }
  });

  it("slug parity holds for the whole collection against progress keys", () => {
    const mdx = EXPECTED.map((e) => {
      const fm = parseLessonFrontmatter(readMdx(e.file));
      return { lesson: fm.lesson, subtopic: fm.subtopic, slug: fm.slug };
    });
    const legacy = lessons.map((l) => ({
      lesson: l.slug,
      subtopics: Object.keys(l.content),
    }));
    const report = checkSlugParity(mdx, legacy);
    expect(report.missing).toEqual([]);
    expect(report.ok).toBe(true);
  });

  it("orders are contiguous per lesson (progress resume order)", () => {
    const byLesson = new Map<string, number[]>();
    for (const e of EXPECTED) {
      const fm = parseLessonFrontmatter(readMdx(e.file));
      const arr = byLesson.get(fm.lesson) ?? [];
      arr.push(fm.order);
      byLesson.set(fm.lesson, arr);
    }
    for (const [lesson, orders] of byLesson) {
      const sorted = [...orders].sort((a, b) => a - b);
      expect(sorted, lesson).toEqual(
        Array.from({ length: sorted.length }, (_, i) => i + 1)
      );
    }
  });

  it("MDX content follows the pilot pattern (Step wrapper, no shuffle-in-content, no JSX-in-data closures)", () => {
    for (const e of EXPECTED) {
      const src = readMdx(e.file);
      expect(src.includes("<Step"), `${e.file}: must use <Step> wrapper`).toBe(
        true
      );
      expect(
        src.includes("shuffle("),
        `${e.file}: shuffle must live inside the component, never in content`
      ).toBe(false);
      expect(
        src.includes("setIsFinished"),
        `${e.file}: stepper callbacks are injected by the renderer, never authored in content`
      ).toBe(false);
    }
  });

  it("only central-map tags are used in MDX content", () => {
    const allowed = new Set([
      "Step",
      "CodeBlock",
      "CodeHighlight",
      "Browser",
      "Image",
      "PracticeQuiz",
      "MultipleChoiceQuiz",
    ]);
    for (const e of EXPECTED) {
      const body = readMdx(e.file).replace(FRONTMATTER_STRIP_RE, "");
      for (const m of body.matchAll(TAG_RE)) {
        expect(allowed.has(m[1]), `${e.file}: unexpected tag <${m[1]}>`).toBe(
          true
        );
      }
    }
  });

  it("cache policy holds: list cacheable, lesson reads static, progress writes always fresh", async () => {
    const policy = await import("@/lib/lessons/cache");
    expect(policy.LESSON_LIST_REVALIDATE).toBeGreaterThan(0);
    expect(policy.LESSON_READ_STATIC).toBe(true);
    expect(policy.PROGRESS_WRITE_FRESH).toBe(true);

    // Lesson list page declares a cacheable hourly window via Cache Components
    // (`"use cache"` + `cacheLife("hours")`, matching the single source of
    // truth LESSON_LIST_REVALIDATE = 3600). The index lives in the (app)
    // group on purpose, so the path below is the authed shell page.
    const listPage = fs.readFileSync(
      path.join(ROOT, "src/app/(app)/lessons/page.tsx"),
      "utf8"
    );
    expect(listPage).toMatch(USE_CACHE_RE);
    expect(listPage).toMatch(CACHE_LIFE_HOURS_RE);
    expect(policy.LESSON_LIST_REVALIDATE).toBe(3600);

    // Progress mutations bypass cache: no "use cache" in the user router.
    const userRouter = fs.readFileSync(
      path.join(ROOT, "src/server/api/routers/user.ts"),
      "utf8"
    );
    expect(userRouter).not.toContain("use cache");
    expect(userRouter).toContain("addProgress");
  });

  it("CI enforces slug parity so slug drift fails the build", () => {
    const workflow = path.join(ROOT, ".github/workflows/lesson-parity.yml");
    expect(
      fs.existsSync(workflow),
      "missing .github/workflows/lesson-parity.yml"
    ).toBe(true);
    const src = fs.readFileSync(workflow, "utf8");
    expect(src).toContain("lesson:parity");
    const pkg = JSON.parse(
      fs.readFileSync(path.join(ROOT, "package.json"), "utf8") as string
    ) as { scripts: Record<string, string> };
    expect(pkg.scripts["lesson:parity"]).toContain(
      "check-lesson-slug-parity.mjs"
    );
  });
});
