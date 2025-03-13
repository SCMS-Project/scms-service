import mongoose, { Document, Schema } from "mongoose";

const CourseSchema = new Schema(
  {
    courseId: { type: String, required: true },
    name: { type: String },
    courseDet: { type: String },
    level: { type: Number },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true }
);

export interface ICourse extends Document {
  courseId: string;
  name: string;
  courseDet: string;
  level?: number;
  subjects: string[];
}

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
