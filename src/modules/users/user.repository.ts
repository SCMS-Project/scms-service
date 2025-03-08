import { Types } from "mongoose";

import { IUser, User } from "./models/user.model";
import HttpException from "../../util/http-exception.model";
import { IStudent, Student } from "./models/student.model";

export const getUsers = async () => {
  try {
    const users: IUser[] = await User.find();
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
    const newStudent = new Student({
      user: id,
      studentId: createUser.studentId,
      enrollmentDate: createUser.enrollmentDate,
    });

    return await newStudent.save();
  } catch (error: any) {
    console.error(`error creating student userId: ${id}, error: ${error}`);
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
