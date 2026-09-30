import { connectToDatabase } from "@/lib/mongodb";
import { Experience, Project } from "@/models";

export interface ExperienceView {
  org: string;
  role: string;
  employmentType?: string;
  timeline: string;
  current: boolean;
  summary?: string;
  highlights: string[];
  skills: string[];
}

export interface ProjectView {
  title: string;
  slug: string;
  summary?: string;
  role?: string;
  org?: string;
  timeline?: string;
  tags: string[];
  tech: string[];
  featured: boolean;
  projectType?: string;
  status: string;
  aiTag?: string;
  platforms: Platform[];
}

export type Platform = "web" | "mobile" | "automation";

const MOBILE_HINTS = ["react native", "expo", "flutter", "capacitor", "apk", "android", "ios"];
const AUTOMATION_HINTS = ["n8n", "telegram bot", "meta ads", "funnel", "google sheets"];
const WEB_HINTS = [
  "next.js", "react", "html", "tailwind", "framer", "landing page",
  "javascript", "node.js", "express", "fastapi", "admin panel", "websockets",
];

function derivePlatforms(tech: string[], tags: string[], override: unknown): Platform[] {
  if (Array.isArray(override) && override.length) return override as Platform[];
  const hay = [...tech, ...tags].map((t) => t.toLowerCase());
  const has = (hints: string[]) => hay.some((h) => hints.some((k) => h.includes(k)));
  const out: Platform[] = [];
  // "react" alone is web, but "react native" / "react-native-*" is mobile.
  const web = hay.map((h) => h.replace(/react[ -]native/g, ""));
  if (web.some((h) => WEB_HINTS.some((k) => h.includes(k)))) out.push("web");
  if (has(MOBILE_HINTS)) out.push("mobile");
  if (has(AUTOMATION_HINTS)) out.push("automation");
  return out.length ? out : ["web"];
}

function fmtRange(
  start?: Date | string,
  end?: Date | string | null,
  current?: boolean
): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" };
  const s = start ? new Date(start).toLocaleDateString("en-US", opts) : "";
  if (current) return s ? `${s} – Present` : "Present";
  const e = end ? new Date(end).toLocaleDateString("en-US", opts) : "";
  if (s && e) return `${s} – ${e}`;
  return s || e || "";
}

export async function getExperiences(): Promise<ExperienceView[]> {
  await connectToDatabase();
  const docs = await Experience.find({ status: "published" })
    .sort({ order: 1 })
    .lean<Record<string, unknown>[]>();

  return docs.map((d) => ({
    org: d.org as string,
    role: d.role as string,
    employmentType: d.employmentType as string | undefined,
    timeline: fmtRange(
      d.startDate as Date,
      d.endDate as Date | null,
      d.current as boolean
    ),
    current: Boolean(d.current),
    summary: d.summary as string | undefined,
    highlights: (d.highlights as string[]) ?? [],
    skills: (d.skills as string[]) ?? [],
  }));
}

export async function getProjects(): Promise<ProjectView[]> {
  await connectToDatabase();
  const docs = await Project.find({})
    .sort({ featured: -1, order: 1 })
    .lean<Record<string, unknown>[]>();

  return docs.map((d) => {
    const metadata = (d.metadata ?? {}) as Record<string, unknown>;
    const tags = (d.tags as string[]) ?? [];
    const tech = (d.tech as string[]) ?? [];
    return {
      title: d.title as string,
      slug: d.slug as string,
      summary: d.summary as string | undefined,
      role: d.role as string | undefined,
      org: d.org as string | undefined,
      timeline: d.timeline as string | undefined,
      tags,
      tech,
      featured: Boolean(d.featured),
      projectType: metadata.projectType as string | undefined,
      status: (d.status as string) ?? "published",
      aiTag: metadata.aiTag as string | undefined,
      platforms: derivePlatforms(tech, tags, metadata.platforms),
    };
  });
}
