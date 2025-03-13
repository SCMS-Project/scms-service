import {
  createLecturer,
  createStudent,
  deleteUser,
  getAllLecturer,
  getAllStudents,
  getUserById,
  getUsers,
  updateUser,
  validateUserById,
} from "./user.repository";
import HttpException from "../../util/http-exception.model";
import { IUser } from "./models/user.model";
import { IStudent } from "./models/student.model";
import { ILecturer } from "./models/lecturer.model";

export const getAllUsers = async () => {
  try {
    const users: IUser[] | null = await getUsers();

    if (!users) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving users",
        result: false,
      });
    }

    return users;
  } catch (error: any) {
    throw error;
  }
};

export const retrieveUserById = async (id: string) => {
  try {
    const user: IUser | null = await getUserById(id);

    if (!user) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving user by id",
        result: false,
      });
    }

    return user;
  } catch (error: any) {
    throw error;
  }
};

export const updateUserDetails = async (id: string, updateUserData: IUser) => {
  try {
    const updatedUser = await updateUser(id, updateUserData);
    if (!updatedUser) {
      throw new HttpException(500, {
        message: `Error updating user with ID: ${id}`,
        result: false,
      });
    }
    return updatedUser;
  } catch (error: any) {
    throw error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const user = await getUserById(id);

    if (user === null) {
      throw new HttpException(202, {
        message: `User ID : ${id} does not exist`,
      });
    }

    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      throw new HttpException(500, {
        message: `Error in deleting user ID: ${id}`,
        result: false,
      });
    }

    return {
      message: `User successfully deleted: ID: ${deletedUser._id}, email: ${deletedUser.email}`,
    };
  } catch (error: any) {
    throw error;
  }
};

export const saveStudent = async (id: string, newStudent: IStudent) => {
  try {
    await validateUser([id], false);

    const student = await createStudent(id, newStudent);
    if (!student) {
      throw new HttpException(500, {
        message: `Error in creating student user ID: ${id}`,
        result: false,
      });
    }

    return student;
  } catch (error) {
    throw error;
  }
};

export const retrieveAllStudents = async () => {
  try {
    const students = await getAllStudents();

    if (!students) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving students",
        result: false,
      });
    }

    return students;
  } catch (error: any) {
    throw error;
  }
};

export const saveLecturer = async (id: string, newLecturer: ILecturer) => {
  try {
    await validateUser([id], false);

    const lecturer = await createLecturer(id, newLecturer);
    if (!lecturer) {
      throw new HttpException(500, {
        message: `Error in creating lecturer user ID: ${id}`,
        result: false,
      });
    }

    return lecturer;
  } catch (error) {
    throw error;
  }
};

export const retrieveAllLecturer = async () => {
  try {
    const lecturer = await getAllLecturer();

    if (!lecturer) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving lecturer",
        result: false,
      });
    }

    return lecturer;
  } catch (error: any) {
    throw error;
  }
};

const validateUser = async (
  id: string[],
  isMongo: boolean
): Promise<string[] | any> => {
  const validatedData = await validateUserById(id, isMongo);

  if (!validatedData || validatedData.length === 0) {
    throw new HttpException(202, {
      message: `UserId not found - ID: ${id}`,
    });
  }

  return validatedData;
};
