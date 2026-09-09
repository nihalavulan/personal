import { connectToDatabase } from "@/lib/mongodb";
import { Profile } from "@/models";

export interface ProfileView {
  name: string;
  tagline?: string;
  bio?: string;
  location?: string;
  email?: string;
  socials: { label: string; url: string; handle?: string }[];
  languages: { name: string; proficiency?: string }[];
  approachSummary?: string;
  approachStyle: string[];
  updatedAt?: string;
}

/**
 * Reads the single Profile document and shapes it into a plain object
 * safe to pass into React server/client components.
 */
export async function getProfile(): Promise<ProfileView | null> {
  await connectToDatabase();
  const doc = await Profile.findOne({}).lean<Record<string, unknown>>();
  if (!doc) return null;

  const metadata = (doc.metadata ?? {}) as Record<string, unknown>;
  const approach = (metadata.approach ?? {}) as Record<string, unknown>;

  return {
    name: (doc.name as string) ?? "",
    tagline: doc.tagline as string | undefined,
    bio: doc.bio as string | undefined,
    location: doc.location as string | undefined,
    email: doc.email as string | undefined,
    socials: (doc.socials as ProfileView["socials"]) ?? [],
    languages: (metadata.languages as ProfileView["languages"]) ?? [],
    approachSummary: approach.summary as string | undefined,
    approachStyle: (approach.problemSolvingStyle as string[]) ?? [],
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt as string).toISOString() : undefined,
  };
}
