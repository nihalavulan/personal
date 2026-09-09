import { connect, disconnect } from "../db";
import { Profile } from "../../src/models";

/**
 * Seeds / updates the single Profile document.
 * Idempotent: re-running updates the same record instead of duplicating.
 * Run with:  npm run seed:profile
 */
async function main() {
  await connect();

  const data = {
    name: "Nihal Avulan",
    tagline: "Self-taught full-stack developer",
    // bio + location intentionally left for Nihal to confirm in his own words.
    socials: [
      {
        label: "GitHub",
        url: "https://github.com/nihalavulan",
        handle: "@nihalavulan",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/nihalavulan/",
        handle: "nihalavulan",
      },
    ],
    metadata: {
      languages: [
        { name: "English", proficiency: "Full professional" },
        { name: "Hindi", proficiency: "Full professional" },
        { name: "Malayalam", proficiency: "Native / bilingual" },
      ],
      sources: {
        note: "Seeded from LinkedIn + GitHub on 2026-08-25; pending Nihal's confirmation of location & bio.",
      },
    },
  };

  const profile = await Profile.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  console.log("✓ Profile saved:", profile.name, `(id ${profile._id})`);

  await disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
