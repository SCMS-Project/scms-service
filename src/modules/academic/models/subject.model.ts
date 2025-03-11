import mongoose, { Document, Schema } from "mongoose";

const SubjectSchema = new Schema(
  {
    subjectName: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

export interface ISubject extends Document {
  subjectName: string;
  course: mongoose.Types.ObjectId;
}

export const Subject = mongoose.model<ISubject>("Subject", SubjectSchema);
