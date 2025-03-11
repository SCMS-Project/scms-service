import mongoose, { Document, Schema } from "mongoose";

const CourseSchema = new Schema(
  {
    courseId: { type: String, required: true },
    name: { type: String },
    level: { type: Number },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true }
);

export interface ICourse extends Document {
  courseId: string;
  name: string;
  level?: number;
}

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
