import { Router, Request, Response, NextFunction } from "express";

import { retrieveAllLecturer, saveLecturer } from "./user.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("retrieveAllLecturer: controller hit");
  try {
    const lecturers = await retrieveAllLecturer();
    res.status(201).json(lecturers);
  } catch (error: any) {
    next(error);
  }
});

router.post("/:id", async (req: Request, res: Response, next: NextFunction) => {
  console.log("saveLecturer: controller hit");
  try {
    const lecturer = await saveLecturer(req.params.id, req.body);
    res.status(201).json(lecturer);
  } catch (error: any) {
    next(error);
  }
});

export { router as lecturerController };
