import { Router } from "express";

import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { studentController } from "./modules/users/student.controller";
import { lecturerController } from "./modules/users/lecturer.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/students", studentController)
  .use("/lecturers", lecturerController);

export default Router().use(routes);
