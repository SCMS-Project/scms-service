import { Router, Request, Response, NextFunction } from "express";
import { getAllUsers } from "./user.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getAllUsers();
    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
});

export { router as userController };
