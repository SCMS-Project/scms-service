import mongoose, { Document, Schema } from "mongoose";

const SubjectSchema = new Schema(
  {
    subjectId: { type: String, required: true },
    subjectName: { type: String },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export interface ISubject extends Document {
  subjectId: string;
  subjectName: string;
}

export const Subject = mongoose.model<ISubject>("Subject", SubjectSchema);
