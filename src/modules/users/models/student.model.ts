import mongoose, { Document, Schema } from "mongoose";

const StudentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    studentId: { type: String, required: true },
    enrollmentDate: { type: String, required: true },
    courseEnrolled: { type: [String] },
  },
  { timestamps: true }
);

export interface IStudent extends Document {
  studentId: string;
  enrollmentDate: string;
  courseEnrolled?: string[];
}

export const Student = mongoose.model<IStudent>("Student", StudentSchema);
