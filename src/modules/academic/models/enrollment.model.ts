import mongoose, { Document, Schema } from "mongoose";

const EnrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    enrollmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  enrollmentDate: Date;
}

export const Enrollment = mongoose.model<IEnrollment>(
  "Enrollment",
  EnrollmentSchema
);
