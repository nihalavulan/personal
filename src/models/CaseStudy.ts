import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * A deep, structured write-up of a project.
 *
 * The body is an ordered list of "blocks" so any UI can render a rich,
 * varied layout (headings, prose, images, quotes, metrics, galleries)
 * without us being locked into one fixed template.
 */
const BlockSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "heading",
        "text", // markdown paragraph(s)
        "image",
        "gallery",
        "quote",
        "list",
        "metric", // a highlighted number + label
        "video",
        "embed",
      ],
    },
    // Flexible payload — shape depends on `type`. Kept as Mixed on purpose.
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const MetricSchema = new Schema(
  {
    label: { type: String, required: true }, // "Conversion lift"
    value: { type: String, required: true }, // "+38%"
    note: { type: String },
  },
  { _id: false }
);

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String },
    summary: { type: String }, // the TL;DR

    // The classic case-study spine (all optional; use what fits).
    problem: { type: String },
    process: { type: String },
    solution: { type: String },
    outcome: { type: String },

    role: { type: String },
    team: { type: String }, // who else was involved
    timeline: { type: String },
    tools: { type: [String], default: [] },

    // Headline results for quick scanning.
    metrics: { type: [MetricSchema], default: [] },

    // The rich, ordered body.
    blocks: { type: [BlockSchema], default: [] },

    coverImageUrl: { type: String },
    tags: { type: [String], default: [] },
    project: { type: Schema.Types.ObjectId, ref: "Project" },

    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type CaseStudyType = InferSchemaType<typeof CaseStudySchema>;

export const CaseStudy =
  models.CaseStudy || model("CaseStudy", CaseStudySchema);
