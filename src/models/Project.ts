import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * A lightweight project entry — the "card" level of detail.
 * A rich write-up lives in a linked CaseStudy (optional).
 */
const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String }, // one/two-line description
    role: { type: String }, // your role on it
    org: { type: String }, // company / client / personal
    timeline: { type: String }, // e.g. "2024" or "Jan–Apr 2024"
    startDate: { type: Date },
    endDate: { type: Date },
    tags: { type: [String], default: [] },
    tech: { type: [String], default: [] }, // tools / stack used
    coverImageUrl: { type: String },
    links: {
      type: [
        {
          label: { type: String, required: true }, // "Live", "GitHub", "Case study"
          url: { type: String, required: true },
          _id: false,
        },
      ],
      default: [],
    },
    // Link to the deep write-up, if one exists.
    caseStudy: { type: Schema.Types.ObjectId, ref: "CaseStudy" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type ProjectType = InferSchemaType<typeof ProjectSchema>;

export const Project =
  models.Project || model("Project", ProjectSchema);
