import { Types } from "mongoose";

import { IUser, User } from "./models/user.model";
import HttpException from "../../util/http-exception.model";
import { IStudent, Student } from "./models/student.model";
import { ILecturer, Lecturer } from "./models/lecturer.model";
import { UserRole } from "../../util/enums";

export const getUsers = async () => {
  try {
    const users: IUser[] = await User.find()
      .select("-password -createdAt -updatedAt -__v")
      .exec();
    return users;
  } catch (error) {
    console.error(`error in retrieving getUsers,  error: ${error}`);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    await validateUserById([id], true);

    const user = await User.findById(id)
      .select("-password -createdAt -updatedAt -__v")
      .exec();
    return user;
  } catch (error) {
    console.error(
      `error in retrieving userById _id: ${id},  error: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  console.log(`getOneUserByEmail: ${email}`);
  try {
    const user = await User.findOne({ email });

    return user;
  } catch (error: any) {
    console.error(`error when retrieving user: ${email}, error: ${error}`);
    throw error;
  }
};

export const createUser = async (
  createUser: IUser
): Promise<IUser | undefined> => {
  try {
    const newUser = new User(createUser);

    return await newUser.save();
  } catch (error: any) {
    console.error(`error creating user: ${createUser.email}, error: ${error}`);
    throw error;
  }
};

export const updateUser = async (id: string, updateUser: IUser) => {
  try {
    await validateUserById([id], true);
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      updateUser
    ).lean();
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user with ID: ${id}, error: ${error}`);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    await validateUserById([id], true);
    const deletedUser = await User.findByIdAndDelete(id).lean();
    return deletedUser;
  } catch (error) {
    console.error(
      `Error occurred when deleting user ID: ${id}, error: ${error}`
    );
    throw error;
  }
};

export const createStudent = async (id: string, createUser: IStudent) => {
  try {
    const studentId = await generateId(UserRole.STUDENT);
    const student = new Student({ ...createUser, studentId, user: id });
    await student.save();

    await User.findByIdAndUpdate(id, {
      student: student._id,
      role: UserRole.STUDENT,
    });

    return student;
  } catch (error: any) {
    console.error(`error creating student userId: ${id}, error: ${error}`);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const students = await User.find({ role: UserRole.STUDENT })
      .populate({
        path: "student",
        select: "-__v -user -createdAt -updatedAt",
      })
      .select("-__v -password -createdAt -updatedAt")
      .exec();

    return students;
  } catch (error) {
    console.error(`error in retrieving all students, error: ${error}`);
    throw error;
  }
};

export const createLecturer = async (id: string, createLecturer: ILecturer) => {
  try {
    const lecturerId = await generateId(UserRole.LECTURER);
    const lecturer = new Lecturer({ ...createLecturer, lecturerId, user: id });
    await lecturer.save();

    await User.findByIdAndUpdate(id, {
      lecturer: lecturer._id,
      role: UserRole.LECTURER,
    });

    return lecturer;
  } catch (error: any) {
    console.error(`error creating lecturer userId: ${id}, error: ${error}`);
    throw error;
  }
};

export const getAllLecturer = async () => {
  try {
    const lecturer = await User.find({ role: UserRole.LECTURER })
      .populate({
        path: "lecturer",
        select: "-__v -user -createdAt -updatedAt",
      })
      .select("-__v -password -createdAt -updatedAt")
      .exec();

    return lecturer;
  } catch (error) {
    console.error(`error in retrieving all lecturer, error: ${error}`);
    throw error;
  }
};

export const validateUserById = async (
  id: string[],
  isMongoId: boolean
): Promise<string[]> => {
  try {
    let users;

    if (isMongoId) {
      const invalidIds = id.filter((id) => !Types.ObjectId.isValid(id));

      if (invalidIds.length > 0) {
        throw new HttpException(202, {
          message: `Invalid Mongo ID(s): ${invalidIds.join(", ")}`,
          result: false,
        });
      }

      users = await User.find({ _id: { $in: id } }, { _id: 1 }).lean();
    } else {
      users = await User.find({ _id: { $in: id } }, { _id: 1 }).lean();

      if (!users.length) {
        throw new HttpException(202, {
          message: "No valid courses found",
          result: false,
        });
      }
    }

    return users.map((user) => user._id.toString());
  } catch (error) {
    console.error(
      `error in validating userById _id: ${id},  error: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }
};

const generateId = async (role: string): Promise<string> => {
  try {
    const userIdRegex = /^[SL]-\d{4}$/;
    let lastRoleId;
    const firstCode = role === UserRole.STUDENT ? "S" : "L";

    if (role === UserRole.STUDENT) {
      const lastStudent = await Student.findOne()
        .sort({ createdAt: -1 })
        .limit(1);

      lastRoleId = lastStudent?.studentId;
    } else {
      const lastLecturer = await Lecturer.findOne()
        .sort({ createdAt: -1 })
        .limit(1);
      lastRoleId = lastLecturer?.lecturerId;
    }

    if (!lastRoleId || !userIdRegex.test(lastRoleId)) {
      return `${firstCode}-0001`;
    }

    const newIdNumber = parseInt(lastRoleId.substring(2), 10) + 1;

    return `${firstCode}-${newIdNumber.toString().padStart(4, "0")}`;
  } catch (error) {
    console.error("Error generating ID:", error);
    throw new HttpException(500, {
      message: "Error generating ID",
      result: false,
    });
  }
};
