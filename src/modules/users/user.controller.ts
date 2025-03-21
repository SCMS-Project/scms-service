import { Router, Request, Response, NextFunction } from "express";

import {
  deleteUserById,
  getAllUsers,
  retrieveUserById,
  updateUserDetails,
} from "./user.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("getAllUsers: controller hit");
  try {
    const users = await getAllUsers();
    res.status(201).json(users);
  } catch (error: any) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  console.log("retrieveUserById: controller hit");
  try {
    const user = await retrieveUserById(req.params.id);
    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  console.log("updateUserDetails: controller hit");
  try {
    const user = await updateUserDetails(req.params.id, req.body);
    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("deleteUserById: controller hit");
    try {
      const user = await deleteUserById(req.params.id);
      res.status(201).json({ ...user });
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as userController };
