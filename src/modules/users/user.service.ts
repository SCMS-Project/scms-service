import HttpException from "../../util/http-exception.model";
import { IUser } from "./models/user.model";
import { getUsers } from "./user.repository";

export const getAllUsers = async () => {
  try {
    const users: IUser[] | null = await getUsers();

    if (users.length === 0) {
      throw new HttpException(202, {
        message: "No users found",
        result: false,
      });
    } else if (!users) {
      throw new HttpException(500, {
        message: "Error occurred when retrieving users",
        result: false,
      });
    }

    return users.map((user) => ({
      _id: user._id,
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      phoneNumber: user.phoneNumber,
      nicNumber: user.nicNumber,
      address: user.address,
    }));
  } catch (error: any) {
    throw error;
  }
};
