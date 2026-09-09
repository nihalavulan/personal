import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models";
import { buildStory, type StorySection } from "@/lib/story";
import { shotsFor, logoFor, docsFor, type Shot, type Doc } from "@/lib/screenshots";

export interface Stat {
  value: string;
  label: string;
}

export interface ProjectDetail {
  title: string;
  slug: string;
  summary?: string;
  role?: string;
  org?: string;
  timeline?: string;
  tags: string[];
  tech: string[];
  projectType?: string;
  status: string;
  links: { label: string; url: string }[];
  stats: Stat[];
  story: StorySection[];
  screenshots: Shot[];
  logo?: string;
  docs: Doc[];
  aiTag?: string;
  aiNote?: string;
  collaborators?: string[];
  techStackNote?: string;
  nameSpellingFlag?: string;
}

export interface ProjectNav {
  slug: string;
  title: string;
}

function toDetail(d: Record<string, unknown>): ProjectDetail {
  const metadata = (d.metadata ?? {}) as Record<string, unknown>;
  return {
    title: d.title as string,
    slug: d.slug as string,
    summary: d.summary as string | undefined,
    role: d.role as string | undefined,
    org: d.org as string | undefined,
    timeline: d.timeline as string | undefined,
    tags: (d.tags as string[]) ?? [],
    tech: (d.tech as string[]) ?? [],
    projectType: metadata.projectType as string | undefined,
    status: (d.status as string) ?? "published",
    links: (d.links as { label: string; url: string }[]) ?? [],
    stats: (metadata.stats as Stat[]) ?? [],
    story: buildStory(metadata.raw as Record<string, unknown> | undefined),
    screenshots: shotsFor(d.slug as string),
    logo: logoFor(d.slug as string),
    docs: docsFor(d.slug as string),
    aiTag: metadata.aiTag as string | undefined,
    aiNote: metadata.aiNote as string | undefined,
    collaborators: metadata.collaborators as string[] | undefined,
    techStackNote: metadata.techStackNote as string | undefined,
    nameSpellingFlag: metadata.nameSpellingFlag as string | undefined,
  };
}

export async function getProjectSlugs(): Promise<string[]> {
  await connectToDatabase();
  const docs = await Project.find({}, { slug: 1 })
    .sort({ featured: -1, order: 1 })
    .lean<{ slug: string }[]>();
  return docs.map((d) => d.slug);
}

export async function getProjectBySlug(
  slug: string
): Promise<{ project: ProjectDetail; prev: ProjectNav; next: ProjectNav } | null> {
  await connectToDatabase();
  const doc = await Project.findOne({ slug }).lean<Record<string, unknown>>();
  if (!doc) return null;

  // Ordered list for prev/next navigation.
  const all = await Project.find({}, { slug: 1, title: 1 })
    .sort({ featured: -1, order: 1 })
    .lean<{ slug: string; title: string }[]>();
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  return {
    project: toDetail(doc),
    prev: { slug: prev.slug, title: prev.title },
    next: { slug: next.slug, title: next.title },
  };
}
