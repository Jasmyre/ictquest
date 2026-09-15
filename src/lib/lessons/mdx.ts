/**
 * MDX lesson-store helpers (migration 06, #29 / ADR-0001).
 *
 * Server-safe and UI-free: frontmatter parsing plus slug-parity checks so
 * existing ProgressData keys ({ topic: lesson slug, subtopic: content key })
 * keep matching after the TSX-to-MDX move. Persistence keeps progress
 * metadata only — there are no Lesson/Topic tables.
 */

export type LessonFrontmatter = {
  lesson: string;
  subtopic: string;
  slug: string;
  title: string;
  order: number;
};

export const PILOT = {
  lesson: "introduction-to-html",
  subtopic: "html_introduction",
  slug: "html_introduction",
  title: "What is HTML and Its History",
  order: 1,
} as const satisfies LessonFrontmatter;

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const LINE_SPLIT_RE = /\r?\n/;
const FRONTMATTER_KV_RE = /^([A-Za-z_]+):\s*(.*)$/;
const QUOTE_TRIM_RE = /^["']|["']$/g;
const REQUIRED_KEYS = ["lesson", "subtopic", "slug", "title", "order"] as const;

export function parseLessonFrontmatter(source: string): LessonFrontmatter {
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error("MDX lesson is missing frontmatter (--- block).");
  }
  const raw: Record<string, string> = {};
  for (const line of match[1].split(LINE_SPLIT_RE)) {
    const kv = line.match(FRONTMATTER_KV_RE);
    if (kv) {
      raw[kv[1]] = kv[2].trim().replace(QUOTE_TRIM_RE, "");
    }
  }
  for (const key of REQUIRED_KEYS) {
    if (!raw[key]) {
      throw new Error(`MDX frontmatter is missing required key: ${key}`);
    }
  }
  const order = Number(raw.order);
  if (!Number.isFinite(order)) {
    throw new Error("MDX frontmatter key 'order' must be numeric.");
  }
  return {
    lesson: raw.lesson,
    subtopic: raw.subtopic,
    slug: raw.slug,
    title: raw.title,
    order,
  };
}

export type LegacyLessonIndex = {
  /** Lesson slug — the `topic` half of ProgressData keys. */
  lesson: string;
  /** Content keys — the `subtopic` half of ProgressData keys. */
  subtopics: string[];
};

export function getLegacyProgressKeys(
  lessons: { slug: string; content: Record<string, unknown> }[]
): { topic: string; subtopic: string }[] {
  return lessons.flatMap((lesson) =>
    Object.keys(lesson.content).map((subtopic) => ({
      topic: lesson.slug,
      subtopic,
    }))
  );
}

export type SlugParityReport = {
  missing: { lesson: string; subtopic: string; slug: string }[];
  extra: { lesson: string; subtopic: string; slug: string }[];
  ok: boolean;
};

/**
 * Every MDX file must resolve to a legacy (lesson, subtopic) pair and the
 * MDX slug must equal the legacy subtopic key — otherwise stored progress
 * rows would stop matching.
 */
export function checkSlugParity(
  mdx: { lesson: string; subtopic: string; slug: string }[],
  legacy: LegacyLessonIndex[]
): SlugParityReport {
  const legacyKeys = new Set(
    legacy.flatMap((l) => l.subtopics.map((s) => `${l.lesson}/${s}`))
  );
  const mdxKeys = new Set(mdx.map((m) => `${m.lesson}/${m.subtopic}`));

  const missing = mdx.filter(
    (m) => !legacyKeys.has(`${m.lesson}/${m.subtopic}`) || m.slug !== m.subtopic
  );
  const extra = [...mdxKeys]
    .filter((k) => !legacyKeys.has(k))
    .map((k) => {
      const found = mdx.find((m) => `${m.lesson}/${m.subtopic}` === k);
      return {
        lesson: found?.lesson ?? k,
        subtopic: found?.subtopic ?? k,
        slug: found?.slug ?? k,
      };
    });
  // `extra` is informational (pilot-only migration); parity fails on missing.
  return { missing, extra, ok: missing.length === 0 };
}
