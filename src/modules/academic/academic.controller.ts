import { Router, Request, Response, NextFunction } from "express";
import {
  retrieveAllCourses,
  retrieveCourseByCourseId,
  saveCourse,
} from "./academic.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("retrieveAllCourses: controller hit");
  try {
    const result = await retrieveAllCourses();
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
});

router.get(
  "/course-id/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("retrieveCourseByCourseId: controller hit");
    try {
      const result = await retrieveCourseByCourseId(req.params.id);
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("saveCourse: controller hit");
  try {
    const course = await saveCourse(req.body);
    res.status(201).json(course);
  } catch (error: any) {
    next(error);
  }
});

export { router as courseController };
