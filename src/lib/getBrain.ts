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
    return {
      title: d.title as string,
      slug: d.slug as string,
      summary: d.summary as string | undefined,
      role: d.role as string | undefined,
      org: d.org as string | undefined,
      timeline: d.timeline as string | undefined,
      tags: (d.tags as string[]) ?? [],
      tech: (d.tech as string[]) ?? [],
      featured: Boolean(d.featured),
      projectType: metadata.projectType as string | undefined,
      status: (d.status as string) ?? "published",
      aiTag: metadata.aiTag as string | undefined,
    };
  });
}
