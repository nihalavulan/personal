import Image from "next/image";
import type { Shot } from "@/lib/screenshots";

/** A browser window or phone frame around a screenshot (or a placeholder). */
export function ScreenshotFrame({
  kind,
  shot,
}: {
  kind: "web" | "app";
  shot?: Shot;
}) {
  if (kind === "app") {
    return (
      <figure className="flex flex-col items-center gap-3">
        <div className="relative w-[220px] overflow-hidden rounded-[2rem] border border-line bg-card p-2 shadow-[0_30px_60px_-30px_rgba(27,25,22,0.4)]">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-paper-2">
            <span className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-ink/15" />
            {shot ? (
              <Image
                src={shot.src}
                alt={shot.caption ?? "App screenshot"}
                fill
                sizes="220px"
                className="object-cover"
              />
            ) : (
              <Placeholder label="App screen" />
            )}
          </div>
        </div>
        {shot?.caption && (
          <figcaption className="text-center text-xs text-ink-faint">
            {shot.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-line bg-card shadow-[0_30px_60px_-35px_rgba(27,25,22,0.45)]">
        <div className="flex items-center gap-1.5 border-b border-line-soft px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        </div>
        <div className="relative aspect-[16/9] bg-paper-2">
          {shot ? (
            <Image
              src={shot.src}
              alt={shot.caption ?? "Web screenshot"}
              fill
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover object-top"
            />
          ) : (
            <Placeholder label="Web screenshot" />
          )}
        </div>
      </div>
      {shot?.caption && (
        <figcaption className="text-xs text-ink-faint">{shot.caption}</figcaption>
      )}
    </figure>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(27,25,22,0.05) 0 1px, transparent 1px 10px)",
      }}
    >
      <span className="eyebrow">{label}</span>
    </div>
  );
}
