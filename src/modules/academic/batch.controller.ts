import { Router, Request, Response, NextFunction } from "express";

import { saveBatch } from "./academic.service";

const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("saveCourse: controller hit");
  try {
    const result = await saveBatch(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
});

export { router as batchController };
