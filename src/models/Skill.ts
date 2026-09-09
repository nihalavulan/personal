import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * A skill / tool / competency, grouped by category so a UI can
 * render them in clusters.
 */
const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String }, // "Design", "Frontend", "Research", "Tools"...
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
    },
    yearsOfExperience: { type: Number },
    iconUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type SkillType = InferSchemaType<typeof SkillSchema>;

export const Skill = models.Skill || model("Skill", SkillSchema);
