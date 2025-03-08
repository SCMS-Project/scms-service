import { Router } from "express";

import { authController } from "./modules/auth/auth.controller";
import { userController } from "./modules/users/user.controller";
import { studentController } from "./modules/users/student.controller";

const routes = Router()
  .use("/auth", authController)
  .use("/users", userController)
  .use("/students", studentController);

export default Router().use(routes);
