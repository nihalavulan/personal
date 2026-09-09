import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * A piece of your writing / thinking — a note, essay, or blog post.
 */
const ThoughtSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String }, // short teaser
    body: { type: String }, // markdown
    tags: { type: [String], default: [] },
    coverImageUrl: { type: String },
    publishedAt: { type: Date },
    readingMinutes: { type: Number },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type ThoughtType = InferSchemaType<typeof ThoughtSchema>;

export const Thought =
  models.Thought || model("Thought", ThoughtSchema);
