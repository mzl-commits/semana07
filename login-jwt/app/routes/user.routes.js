import { Router } from "express";
import controller from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = Router();
router.get("/all", controller.allAccess);
router.get("/user", [authJwt.verifyToken], controller.userBoard);
router.get("/mod", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

export default router;
