import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * A place you've worked / a role you've held.
 */
const ExperienceSchema = new Schema(
  {
    org: { type: String, required: true }, // company / organization
    role: { type: String, required: true }, // your title
    location: { type: String },
    employmentType: { type: String }, // full-time, contract, internship, freelance...
    startDate: { type: Date },
    endDate: { type: Date }, // null / undefined = current
    current: { type: Boolean, default: false },
    summary: { type: String }, // what the role was about (markdown)
    highlights: { type: [String], default: [] }, // bullet-point wins
    skills: { type: [String], default: [] },
    links: {
      type: [
        {
          label: { type: String, required: true },
          url: { type: String, required: true },
          _id: false,
        },
      ],
      default: [],
    },
    logoUrl: { type: String },
    order: { type: Number, default: 0 }, // manual sort within a UI
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type ExperienceType = InferSchemaType<typeof ExperienceSchema>;

export const Experience =
  models.Experience || model("Experience", ExperienceSchema);
