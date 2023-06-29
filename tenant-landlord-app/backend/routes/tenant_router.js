import {
  controllerLoginTenant

} from "../controller/tenant_controller.js";
import express from "express";
import { checkToken } from "../auth/token_validation.js";

const router = express.Router();

/**
 * API CALLS
 * 1. Login into tenant account
 * 2. Create service ticket
 */

router.post("/login", controllerLoginTenant);
export default router;