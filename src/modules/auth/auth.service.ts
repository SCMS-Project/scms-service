import dotenv from "dotenv";

import { createUser, getOneUserByEmail } from "../users/user.repository";
import { IUser, User } from "../users/models/user.model";
import { AuthResult, LoginInput } from "./interface/auth.interface";
import HttpException from "../../util/http-exception.model";
import { encrypt } from "./encrypt";
import { UserRole } from "../../util/enums";

dotenv.config();

export const signup = async (registerUser: IUser): Promise<AuthResult> => {
  try {
    const newUser = new User({
      ...registerUser,
      role: UserRole.USER,
    });
    await createUser(newUser);

    const token = encrypt.generateToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      message: "Registration successful",
      result: true,
      data: {
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    if (error.code === 11000) {
      throw new HttpException(409, {
        message: "Email already exist",
        result: false,
        data: {
          accessToken: null,
        },
        error: { errmsg: error.errorResponse.errmsg },
      });
    } else {
      throw new HttpException(500, {
        message: "Server error",
        error: { error },
      });
    }
  }
};

export const login = async (loginInput: LoginInput): Promise<AuthResult> => {
  try {
    const user: any = await getOneUserByEmail(loginInput.email);
    if (!user) {
      throw new HttpException(401, {
        message: "Invalid email or password",
        result: false,
      });
    }

    const isMatch = await encrypt.verifyPassword(
      user.password,
      loginInput.password
    );

    if (!isMatch) {
      throw new HttpException(401, {
        message: "Invalid email or password",
        result: false,
      });
    }

    const token = encrypt.generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Login successful",
      result: true,
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    throw error;
  }
};
