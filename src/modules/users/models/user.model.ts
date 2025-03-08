import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const UserSchema = new Schema(
  {
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    nicNumber: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String },
    student: { type: Schema.Types.ObjectId, ref: "Student" },
    lecturer: { type: Schema.Types.ObjectId, ref: "Lecturer" },
    password: { type: String },
  },
  { timestamps: true }
);

// **Pre-save hook to hash password before saving**
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

export interface IUser extends Document {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  nicNumber: string;
  address: string;
  role: string;
  password: string;
}

export const User = mongoose.model<IUser>("User", UserSchema);
