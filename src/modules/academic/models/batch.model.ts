import mongoose, { Document, Schema } from "mongoose";

const BatchSchema = new Schema(
  {
    batchYear: { type: Number, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true }, // M:1 relationship with Course
  },
  { timestamps: true }
);

export interface IBatch extends Document {
  batchYear: number;
  course: mongoose.Types.ObjectId;
}

export const Batch = mongoose.model<IBatch>("Batch", BatchSchema);
