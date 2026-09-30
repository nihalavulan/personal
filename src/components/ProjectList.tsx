"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Platform, ProjectView } from "@/lib/getBrain";

const typeLabel: Record<string, string> = {
  startup: "Startup",
  contract: "Contract",
  personal: "Personal",
  employment: "Employment",
};

const platformLabel: Record<Platform, string> = {
  web: "Web",
  mobile: "Mobile",
  automation: "Automation",
};

type Filter = Platform | null;

function matches(p: ProjectView, f: Filter): boolean {
  return !f || p.platforms.includes(f);
}

function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 border px-3 py-1.5 text-sm transition ${
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-line text-ink-soft hover:border-ink-faint hover:text-ink"
      }`}
    >
      {children}
      {count !== undefined && (
        <span className={`tabular-nums text-xs ${active ? "text-accent" : "text-ink-faint"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function ProjectList({ projects }: { projects: ProjectView[] }) {
  const [filter, setFilter] = useState<Filter>(null);

  const platforms = useMemo(
    () =>
      (Object.keys(platformLabel) as Platform[])
        .map((pl) => ({ value: pl, count: projects.filter((p) => p.platforms.includes(pl)).length }))
        .filter((x) => x.count > 0),
    [projects]
  );

  // Matching projects move to the top; the rest follow, dimmed. Original order is kept within each group.
  const ordered = useMemo(() => {
    const hit = projects.filter((p) => matches(p, filter));
    const miss = projects.filter((p) => !matches(p, filter));
    return [...hit.map((p) => ({ p, hit: true })), ...miss.map((p) => ({ p, hit: false }))];
  }, [projects, filter]);

  const matchCount = filter ? ordered.filter((o) => o.hit).length : projects.length;

  const toggle = (f: Platform) => setFilter((cur) => (cur === f ? null : f));

  return (
    <>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Chip active={!filter} count={projects.length} onClick={() => setFilter(null)}>
            All
          </Chip>
          {platforms.map(({ value, count }) => (
            <Chip
              key={value}
              active={filter === value}
              count={count}
              onClick={() => toggle(value)}
            >
              {platformLabel[value]}
            </Chip>
          ))}
        </div>
        {filter && (
          <p className="eyebrow" aria-live="polite">
            {matchCount} matching · showing first
          </p>
        )}
      </div>

      <ul>
        {ordered.map(({ p, hit }, i) => (
          <li
            key={p.slug}
            className={`transition-opacity duration-300 ${hit ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
          >
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
                <span className="max-w-2xl text-sm text-ink-soft sm:text-base">{p.summary}</span>
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
    </>
  );
}
