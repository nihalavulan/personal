import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/getProject";
import { ScreenshotFrame } from "@/components/ScreenshotFrame";
import { placeholderPlan } from "@/lib/screenshots";
import type { Phase, StoryNode, StorySection } from "@/lib/story";

export const dynamic = "force-dynamic";

const PHASE_ORDER: Phase[] = ["Problem", "Thinking", "Solution", "Result"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) return { title: "Project — Nihal Avulan" };
  return {
    title: `${result.project.title} — Nihal Avulan`,
    description: result.project.summary,
  };
}

function Nodes({ nodes }: { nodes: StoryNode[] }) {
  return (
    <div className="flex flex-col gap-4">
      {nodes.map((node, i) => {
        if (node.type === "p") {
          return (
            <p key={i} className="leading-relaxed text-ink-soft">
              {node.text}
            </p>
          );
        }
        if (node.type === "list") {
          return (
            <ul key={i} className="flex flex-col gap-2">
              {node.items.map((it, j) => (
                <li key={j} className="flex gap-3 text-ink-soft">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <dl key={i} className="flex flex-col divide-y divide-line-soft">
            {node.items.map((it, j) => (
              <div key={j} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                <dt className="shrink-0 font-medium sm:w-40">{it.term}</dt>
                <dd className="leading-relaxed text-ink-soft">{it.desc}</dd>
              </div>
            ))}
          </dl>
        );
      })}
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);
  if (!result) notFound();

  const { project: p, prev, next } = result;

  // Group story sections into narrative phases.
  const chapters = PHASE_ORDER.map((phase) => ({
    phase,
    sections: p.story.filter((s: StorySection) => s.phase === phase),
  })).filter((c) => c.sections.length > 0);

  const shots = p.screenshots;
  const plan = shots.length > 0 ? [] : placeholderPlan[slug] ?? ["web", "app"];

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="eyebrow text-ink transition hover:text-accent">
          ← Nihal Avulan
        </Link>
        <Link href="/#work" className="eyebrow text-ink-soft transition hover:text-ink">
          All work
        </Link>
      </header>

      {/* ---- title block ---- */}
      <section className="px-6 pt-10 sm:px-10">
        <div className="border-b border-line pb-12">
          <p className="eyebrow mb-5">
            {[p.projectType, p.timeline].filter(Boolean).join(" · ")}
          </p>
          {p.logo && (
            <div className="mb-6 inline-flex overflow-hidden rounded-xl border border-line bg-white p-1">
              <Image
                src={p.logo}
                alt={`${p.title} logo`}
                width={56}
                height={56}
                className="h-14 w-auto rounded-lg object-contain"
              />
            </div>
          )}
          <h1 className="font-display text-6xl font-light leading-[0.95] tracking-tight sm:text-8xl">
            {p.title}
          </h1>
          {p.summary && (
            <p className="mt-8 max-w-2xl text-xl leading-relaxed text-ink-soft">
              {p.summary}
            </p>
          )}

          {/* meta grid */}
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {p.role && <Meta label="Role" value={p.role} />}
            {p.org && <Meta label="Context" value={p.org} />}
            {p.tech.length > 0 && (
              <Meta label="Stack" value={p.tech.join(", ")} />
            )}
            {p.links.length > 0 && (
              <div className="flex flex-col gap-1">
                <span className="eyebrow">Links</span>
                <div className="flex flex-col gap-1">
                  {p.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink transition hover:text-accent"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* honest flags */}
          {(p.aiTag || p.collaborators || p.techStackNote || p.nameSpellingFlag) && (
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {p.aiTag && (
                <span className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent">
                  {p.aiTag}
                </span>
              )}
              {p.collaborators && p.collaborators.length > 0 && (
                <span className="text-xs text-ink-faint">
                  With {p.collaborators.join(", ")}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ---- stats ---- */}
      {p.stats.length > 0 && (
        <section className="px-6 py-14 sm:px-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {p.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="font-display text-5xl text-accent sm:text-6xl">
                  {s.value}
                </span>
                <span className="text-sm text-ink-soft">{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---- screenshots ---- */}
      <section className="px-6 py-10 sm:px-10">
        <div className="flex flex-wrap items-start justify-center gap-8 rounded-2xl bg-paper-2 p-8 sm:p-14">
          {shots.length > 0
            ? shots.map((shot, i) => (
                <div
                  key={i}
                  className={shot.kind === "web" ? "w-full max-w-3xl" : ""}
                >
                  <ScreenshotFrame kind={shot.kind} shot={shot} />
                </div>
              ))
            : plan.map((kind, i) => (
                <div key={i} className={kind === "web" ? "w-full max-w-3xl" : ""}>
                  <ScreenshotFrame kind={kind} />
                </div>
              ))}
        </div>
        {shots.length === 0 && (
          <p className="mt-4 text-center text-xs text-ink-faint">
            Screenshots coming soon.
          </p>
        )}
      </section>

      {/* ---- embedded documents (e.g. brand-design PDF) ---- */}
      {p.docs.length > 0 && (
        <section className="px-6 py-10 sm:px-10">
          {p.docs.map((doc) => (
            <div key={doc.src} className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between border-b border-line pb-3">
                <h2 className="font-display text-2xl sm:text-3xl">{doc.label}</h2>
                <a
                  href={doc.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow text-ink-soft transition hover:text-accent"
                >
                  Open PDF ↗
                </a>
              </div>
              {doc.image ? (
                <div className="max-h-[85vh] overflow-y-auto rounded-xl border border-line bg-paper-2">
                  {/* Pre-rendered image of the PDF — reliable on mobile, unlike an embed. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doc.image} alt={`${doc.label} — ${p.title}`} className="w-full" />
                </div>
              ) : (
                <object
                  data={doc.src}
                  type="application/pdf"
                  className="h-[75vh] w-full rounded-xl border border-line bg-paper-2"
                >
                  <div className="flex h-full items-center justify-center">
                    <a href={doc.src} target="_blank" rel="noopener noreferrer" className="text-accent">
                      View {doc.label} (PDF) ↗
                    </a>
                  </div>
                </object>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ---- the story, by phase ---- */}
      <section className="px-6 py-10 sm:px-10">
        {chapters.map((chapter, ci) => (
          <div key={chapter.phase} className="border-t border-line py-14">
            <div className="mb-10 flex items-baseline gap-4">
              <span className="eyebrow text-accent">
                {String(ci + 1).padStart(2, "0")}
              </span>
              <h2 className="font-display text-4xl italic sm:text-5xl">
                {chapter.phase}
              </h2>
            </div>

            <div className="flex flex-col gap-12">
              {chapter.sections.map((section) => (
                <div
                  key={section.key}
                  className="grid gap-4 sm:grid-cols-[220px_1fr] sm:gap-10"
                >
                  <h3 className="font-display text-xl text-ink sm:text-2xl">
                    {section.label}
                  </h3>
                  <div className="max-w-2xl">
                    <Nodes nodes={section.nodes} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ---- next / prev ---- */}
      <footer className="mt-10 grid grid-cols-2 border-t border-line">
        <Link
          href={`/projects/${prev.slug}`}
          className="group flex flex-col gap-1 border-r border-line px-6 py-10 sm:px-10"
        >
          <span className="eyebrow">← Previous</span>
          <span className="font-display text-2xl transition-colors group-hover:text-accent sm:text-3xl">
            {prev.title}
          </span>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="group flex flex-col items-end gap-1 px-6 py-10 text-right sm:px-10"
        >
          <span className="eyebrow">Next →</span>
          <span className="font-display text-2xl transition-colors group-hover:text-accent sm:text-3xl">
            {next.title}
          </span>
        </Link>
      </footer>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="eyebrow">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}
