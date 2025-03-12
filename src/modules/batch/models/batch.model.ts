import mongoose, { Document, Schema } from "mongoose";

const BatchSchema = new Schema(
  {
    batchId: { type: String, require: true },
    batchName: { type: String },
    batchYear: { type: Number },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

export interface IBatch extends Document {
  batchId: string;
  batchName?: string;
  batchYear?: number;
  studentCount?: number;
  courses: string[];
  students: string[];
}

export const Batch = mongoose.model<IBatch>("Batch", BatchSchema);
