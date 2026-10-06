import { Router } from "express";
import controller from "../controllers/auth.controller.js";
import { verifySignUp, authJwt } from "../middlewares/index.js";

const router = Router();
router.post("/signup", [verifySignUp.validateSignup, verifySignUp.checkRolesExisted, verifySignUp.checkDuplicateUsernameOrEmail], controller.signup);
router.get("/me", authJwt.verifyToken, controller.me);
router.post("/signin", controller.signin);
router.post("/refreshtoken", controller.refreshToken);
router.post("/signout", controller.signout);

export default router;
