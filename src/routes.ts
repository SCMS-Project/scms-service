import { Router } from "express";

import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { studentController } from "./modules/users/student.controller";
import { lecturerController } from "./modules/users/lecturer.controller";
import { courseController } from "./modules/academic/course.controller";
import { subjectController } from "./modules/academic/subject.controller";
import { batchController } from "./modules/batch/batch.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/students", studentController)
  .use("/lecturers", lecturerController)
  .use("/courses", courseController)
  .use("/subjects", subjectController)
  .use("/batch", batchController);

export default Router().use(routes);
