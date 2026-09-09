import Link from "next/link";
import { getProfile } from "@/lib/getProfile";
import { getProjects } from "@/lib/getBrain";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = {
  startup: "Startup",
  contract: "Contract",
  personal: "Personal",
  employment: "Employment",
};

export default async function Home() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const name = profile?.name ?? "Nihal Avulan";
  const firstName = name.split(" ")[0];

  return (
    <div className="min-h-screen">
      {/* ---------------------------------------------------------------- */}
      {/* HERO — exactly one viewport, full bleed                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="flex h-screen w-full flex-col justify-between px-6 py-6 sm:px-10 sm:py-8">
        {/* top bar */}
        <header className="flex items-center justify-between">
          <span className="eyebrow text-ink">{name}</span>
          <nav className="flex items-center gap-5 text-sm">
            <a href="#work" className="text-ink-soft transition hover:text-ink">
              Work
            </a>
            <a href="#approach" className="text-ink-soft transition hover:text-ink">
              Approach
            </a>
            {profile?.socials.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-ink-soft transition hover:text-ink sm:inline"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </header>

        {/* headline */}
        <div className="flex max-w-5xl flex-col gap-6">
          <p className="eyebrow">
            {profile?.tagline ?? "Product Engineer"} — selected work
          </p>
          <h1 className="font-display text-[13vw] font-light leading-[0.95] tracking-tight sm:text-[8.5vw] lg:text-[7rem]">
            I start with the
            <br />
            <span className="italic text-accent">problem</span>, not the
            technology.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft">
            {firstName} builds products by understanding the real problem, the
            people who have it, and the existing behaviour around it — then
            shipping the smallest thing that actually solves it.
          </p>
        </div>

        {/* scroll cue */}
        <a
          href="#work"
          className="group flex items-center justify-between border-t border-line pt-5"
        >
          <span className="eyebrow">Scroll — {projects.length} projects</span>
          <span className="text-2xl text-ink-soft transition group-hover:translate-y-1 group-hover:text-accent">
            ↓
          </span>
        </a>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SELECTED WORK — editorial numbered index                         */}
      {/* ---------------------------------------------------------------- */}
      <section id="work" className="px-6 pb-8 pt-20 sm:px-10">
        <div className="mb-10 flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="font-display text-3xl italic sm:text-4xl">
            Selected work
          </h2>
          <span className="eyebrow">{projects.length} projects</span>
        </div>

        <ul>
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border-b border-line py-7 transition-colors sm:gap-x-10"
              >
                <span className="eyebrow tabular-nums text-ink-faint group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-col gap-1.5">
                  <span className="font-display text-3xl leading-none tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-5xl">
                    {p.title}
                  </span>
                  <span className="max-w-2xl text-sm text-ink-soft sm:text-base">
                    {p.summary}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {p.tech.slice(0, 4).map((t) => (
                      <span key={t} className="eyebrow text-ink-faint">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-self-end">
                  <span className="hidden text-right eyebrow sm:block">
                    {p.projectType ? typeLabel[p.projectType] : ""}
                    {p.timeline ? ` · ${p.timeline}` : ""}
                  </span>
                  <span className="text-xl text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-accent">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* APPROACH                                                         */}
      {/* ---------------------------------------------------------------- */}
      {profile?.approachStyle && profile.approachStyle.length > 0 && (
        <section id="approach" className="px-6 py-24 sm:px-10">
          <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-[1fr_1.4fr]">
            <div className="flex flex-col gap-4">
              <p className="eyebrow">How I work</p>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">
                {profile.approachSummary ??
                  "Start from the problem, not the tool."}
              </h2>
            </div>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {profile.approachStyle.slice(0, 8).map((s, i) => (
                <li
                  key={i}
                  className="flex gap-3 border-t border-line-soft pt-4 text-ink-soft"
                >
                  <span className="eyebrow text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Get in touch</p>
            <p className="font-display text-3xl sm:text-4xl">
              Let&apos;s build something.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {profile?.socials.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 border border-line px-4 py-2 text-sm transition hover:border-accent hover:text-accent"
              >
                {s.label}
                <span className="text-ink-faint transition group-hover:text-accent">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
        <p className="mt-10 eyebrow text-ink-faint">
          © {new Date().getFullYear()} {name}
        </p>
      </footer>
    </div>
  );
}
