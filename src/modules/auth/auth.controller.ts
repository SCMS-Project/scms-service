import { Router, Request, Response, NextFunction } from "express";

import { login, signup } from "./auth.service";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await signup({ ...req.body.user });

      res.status(201).json({ ...user });
    } catch (error: any) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log({ ...req.body });
      const result = await login({ ...req.body });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Token Management
// /auth/refresh

// Password Management
//	/auth/forgot-password
// /auth/reset-password

export { router as authController };
