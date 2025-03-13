import { Router, Request, Response, NextFunction } from "express";

import {
  deleteSubject,
  retrieveAllSubjects,
  saveSubject,
  updateSubject,
} from "./academic.service";

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

router.post(
  "/update",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("updateSubject: controller hit");
    try {
      const course = await updateSubject(req.body);
      res.status(201).json(course);
    } catch (error: any) {
      next(error);
    }
  }
);

router.post(
  "/update-course",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("updateSubject: controller hit");
    try {
      const course = await updateSubject(req.body);
      res.status(201).json(course);
    } catch (error: any) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("deleteSubject: controller hit");
    try {
      const course = await deleteSubject(req.params.id);
      res.status(201).json(course);
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as subjectController };
