import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connect, disconnect } from "../db";
import { RawSource } from "../../src/models";

/**
 * Stores Nihal's original raw inputs VERBATIM (untouched) as the source of
 * truth. The structured Project/Experience records are derived from these.
 * Run with:  npm run seed:raw
 */

const sources = [
  {
    key: "career-dump-2026-09-05",
    title: "Portfolio Databrain — raw project / career information",
    sourceType: "dump",
    capturedAt: new Date("2026-09-05"),
    file: "career-dump-2026-09-05.txt",
    derivedInto: [
      "experience:Mapout",
      "experience:GroupyGo",
      "experience:Independent/Freelance",
      "project:groupygo",
      "project:capmylead",
      "project:prime-circle",
      "project:reputup",
      "project:tradify",
      "project:aerobix",
      "project:macro-bowls",
      "project:one-chat",
      "profile.metadata.approach",
    ],
  },
];

async function main() {
  await connect();

  for (const s of sources) {
    const content = readFileSync(
      join(process.cwd(), "data", "raw", s.file),
      "utf8"
    );
    const doc = await RawSource.findOneAndUpdate(
      { key: s.key },
      {
        key: s.key,
        title: s.title,
        sourceType: s.sourceType,
        capturedAt: s.capturedAt,
        content, // stored exactly as received
        derivedInto: s.derivedInto,
      },
      { upsert: true, setDefaultsOnInsert: true, returnDocument: "after" }
    );
    console.log(
      `✓ RawSource "${doc.key}" stored — ${content.length} chars, verbatim.`
    );
  }

  await disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
