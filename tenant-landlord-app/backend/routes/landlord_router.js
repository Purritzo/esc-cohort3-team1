import {
  controllerCreateLandlord,
  controllerLoginLandlord,
} from "../controller/landlord_controller.js";
import express from "express";
//import { checkToken } from "../backend/auth/token_validation.js";

const router = express.Router();

/**
 * API CALLS
 * 1. Create landlord account
 * 2. Login into landlord account
 * 3. View and update service ticket
 */
router.post("/create", controllerCreateLandlord);
router.post("/login", controllerLoginLandlord);
export default router;
