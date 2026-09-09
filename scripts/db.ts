import mongoose from "mongoose";

/**
 * Shared connection helper for standalone scripts (run via tsx).
 * Reads MONGODB_URI from .env.local (loaded by `tsx --env-file`).
 */
export async function connect(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Check .env.local");
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  return mongoose;
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect();
}
