import { NextFunction, Request, Response } from "express";
import HttpException from "../util/http-exception.model";

export const errorHandler = (
  error: Error | HttpException | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`Error: ${JSON.stringify(error.message)}`);
  return res.status(error.errorCode).json(error.message);
};
