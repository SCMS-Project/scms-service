import mongoose, { Document, Schema } from "mongoose";
import { StringDecoder } from "node:string_decoder";

const EnrollmentSchema = new Schema(
  {
    enrollmentId: { type: String },
    batch: { type: Schema.Types.ObjectId, ref: "Batch" },
    course: { type: Schema.Types.ObjectId, ref: "Batch" },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    enrollmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export interface IEnrollment extends Document {
  enrollmentId: string;
  batch: string;
  course: string;
  subjects: string[];
  enrollmentDate: Date;
}

export const Enrollment = mongoose.model<IEnrollment>(
  "Enrollment",
  EnrollmentSchema
);
