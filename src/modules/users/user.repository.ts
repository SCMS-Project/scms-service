import { Types } from "mongoose";

import { IUser, User } from "./models/user.model";
import HttpException from "../../util/http-exception.model";
import { IStudent, Student } from "./models/student.model";
import { ILecturer, Lecturer } from "./models/lecturer.model";
import { UserRole } from "../../util/enums";

export const getUsers = async (select: string) => {
  try {
    const users: IUser[] = await User.find().select(select).exec();
    return users;
  } catch (error) {
    console.error(`error in retrieving getUsers,  error: ${error}`);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    await validateUserById(id);

    const user = await User.findById(id);
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
    await validateUserById(id);
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
    await validateUserById(id);
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
    const student = new Student({ ...createUser, user: id });
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
    const lecturer = new Lecturer({ ...createLecturer, user: id });
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

export const validateUserById = async (id: string): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException(202, {
        message: "Not a valid mongo ID",
        result: false,
      });
    }

    const userExists = await User.exists({ _id: id });
    return !!userExists;
  } catch (error) {
    console.error(
      `error in validating userById _id: ${id},  error: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }
};
