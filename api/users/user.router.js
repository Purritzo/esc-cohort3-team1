import {
  controllerCreateUser,
  controllerGetUsers,
  controllerGetUserByUserId,
  controllerUpdateUser,
  controllerDeleteUser,
  controllerLogin,
} from "./user.controller.js";
import express from "express";
import { checkToken } from "../../auth/token_validation.js";

const router = express.Router();

router.post("/", checkToken, controllerCreateUser);
router.get("/", checkToken, controllerGetUsers);
router.get("/:id", checkToken, controllerGetUserByUserId);
router.patch("/", checkToken, controllerUpdateUser);
router.delete("/", checkToken, controllerDeleteUser);
router.post("/login", controllerLogin);

export default router;
