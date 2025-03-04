import { Router } from "express";

import { authController } from "./modules/auth/auth.controller";

const routes = Router().use("/auth", authController);

export default Router().use(routes);
