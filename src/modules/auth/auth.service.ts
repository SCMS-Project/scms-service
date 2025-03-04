import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import { createUser, getOneUserByEmail } from "../users/user.repository";
import { IUser, User } from "../users/models/user.model";
import { AuthResult, LoginInput } from "./interface/auth.interface";
import HttpException from "../../util/http-exception.model";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export const signup = async (registerUser: IUser): Promise<AuthResult> => {
  try {
    const newUser = new User({
      ...registerUser,
      role: "user",
    });
    await createUser(newUser);

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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
    console.log(loginInput);
    const user: any = await getOneUserByEmail(loginInput.email);
    if (!user) {
      throw new HttpException(401, { message: "Invalid email or password" });
    }

    console.log(`is match ${loginInput.password}  ${user.password}`);

    const isMatch = await bcrypt.compare(loginInput.password, user.password);
    if (!isMatch) {
      throw new HttpException(401, { message: "Invalid email or password" });
    }

    console.log("sign in");

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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
    throw new HttpException(500, {
      message: "Server error",
      error: { error },
    });
  }
};
