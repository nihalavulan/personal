import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";

/**
 * A verbatim source document — Nihal's original, unedited input (e.g. a raw
 * career/project dump). This is the untouched source of truth. The structured
 * collections (Project, Experience, etc.) are DERIVED from these; if the two
 * ever disagree, the RawSource wins.
 *
 * We never paraphrase or trim `content` — it is stored exactly as received.
 */
const RawSourceSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // stable id, e.g. "career-dump-2026-09-05"
    title: { type: String, required: true },
    sourceType: { type: String, default: "dump" }, // dump, note, transcript...
    capturedAt: { type: Date },
    content: { type: String, required: true }, // verbatim, untouched
    // What structured records were derived from this source.
    derivedInto: { type: [String], default: [] },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type RawSourceType = InferSchemaType<typeof RawSourceSchema>;

export const RawSource =
  models.RawSource || model("RawSource", RawSourceSchema);
