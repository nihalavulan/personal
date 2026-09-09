import { connect, disconnect } from "./db";
import {
  Profile,
  Experience,
  Project,
  CaseStudy,
  Thought,
  Skill,
  RawSource,
} from "../src/models";

/**
 * Prints a snapshot of what's currently in the brain.
 * Run with:  npm run db:status
 */
async function main() {
  await connect();

  const [profiles, experiences, projects, caseStudies, thoughts, skills, rawSources] =
    await Promise.all([
      Profile.countDocuments(),
      Experience.countDocuments(),
      Project.countDocuments(),
      CaseStudy.countDocuments(),
      Thought.countDocuments(),
      Skill.countDocuments(),
      RawSource.countDocuments(),
    ]);

  console.log("\n🧠  Brain contents");
  console.log("──────────────────────────");
  console.log(`Profile      ${profiles}`);
  console.log(`Experience   ${experiences}`);
  console.log(`Project      ${projects}`);
  console.log(`CaseStudy    ${caseStudies}`);
  console.log(`Thought      ${thoughts}`);
  console.log(`Skill        ${skills}`);
  console.log(`RawSource    ${rawSources}  (verbatim originals)`);
  console.log("──────────────────────────\n");

  await disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
