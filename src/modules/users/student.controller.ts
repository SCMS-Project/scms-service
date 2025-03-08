import { Router, Request, Response, NextFunction } from "express";
import { retrieveAllStudents, saveStudent } from "./user.service";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("retrieveAllStudents: controller hit");
  try {
    const students = await retrieveAllStudents();
    res.status(201).json(students);
  } catch (error: any) {
    next(error);
  }
});

router.post("/:id", async (req: Request, res: Response, next: NextFunction) => {
  console.log("saveStudent: controller hit");
  try {
    const student = await saveStudent(req.params.id, req.body);
    res.status(201).json(student);
  } catch (error: any) {
    next(error);
  }
});

export { router as studentController };
