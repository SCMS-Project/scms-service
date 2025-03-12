import { Router, Request, Response, NextFunction } from "express";
import { retrieveAllBatch, saveBatch } from "./batch.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("retrieveAllBatch: controller hit");
  try {
    const result = await retrieveAllBatch();
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("saveBatch: controller hit");
  try {
    const result = await saveBatch(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
});

export { router as batchController };
