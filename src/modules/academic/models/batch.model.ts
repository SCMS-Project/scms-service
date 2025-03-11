import mongoose, { Document, Schema } from "mongoose";

const BatchSchema = new Schema(
  {
    batchId: { type: String, require: true },
    batchName: { type: String },
    batchYear: { type: Number },
  },
  { timestamps: true }
);

export interface IBatch extends Document {
  batchId: string;
  batchName: string;
  batchYear: number;
}

export const Batch = mongoose.model<IBatch>("Batch", BatchSchema);
