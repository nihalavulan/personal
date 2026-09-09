import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * The single "about you" document. There is only ever one Profile.
 */
const SocialLinkSchema = new Schema(
  {
    label: { type: String, required: true }, // e.g. "GitHub", "LinkedIn", "X"
    url: { type: String, required: true },
    handle: { type: String }, // e.g. "@nihalavulan"
  },
  { _id: false }
);

const ProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String }, // short one-liner under your name
    bio: { type: String }, // longer "about me" (markdown allowed)
    location: { type: String },
    email: { type: String },
    avatarUrl: { type: String },
    resumeUrl: { type: String },
    socials: { type: [SocialLinkSchema], default: [] },
    // Free-form extras so we never get blocked adding a new field of "you".
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type ProfileType = InferSchemaType<typeof ProfileSchema>;

export const Profile =
  models.Profile || model("Profile", ProfileSchema);
