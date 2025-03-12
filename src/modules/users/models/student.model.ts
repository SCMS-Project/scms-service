import mongoose, { Document, Schema } from "mongoose";

const StudentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    studentId: { type: String, required: true },
    enrollments: [{ type: Schema.Types.ObjectId, ref: "Enrollment" }],
  },
  { timestamps: true }
);

export interface IStudent extends Document {
  studentId: string;
  enrollments?: string[];
}

export const Student = mongoose.model<IStudent>("Student", StudentSchema);
