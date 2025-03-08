import mongoose, { Document, Schema } from "mongoose";

const LecturerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    lecturerId: { type: String, required: true },
    designation: { type: String, required: true },
    hireDate: { type: String, required: true },
    qualifications: { type: [String] },
    subjectsTaught: { type: [String] },
  },
  { timestamps: true }
);

export interface ILecturer extends Document {
  lecturerId: string;
  designation: string;
  hireDate: string;
  qualifications: string[];
  subjectsTaught: string[];
}

export const Lecturer = mongoose.model<ILecturer>("Lecturer", LecturerSchema);
