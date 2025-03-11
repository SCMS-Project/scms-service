import { Router, Request, Response, NextFunction } from "express";

import { retrieveAllSubjects, saveSubject } from "./academic.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("retrieveAllSubjects: controller hit");
  try {
    const course = await retrieveAllSubjects();
    res.status(201).json(course);
  } catch (error: any) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("saveCourse: controller hit");
  try {
    const course = await saveSubject(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    next(error);
  }
});

export { router as subjectController };
