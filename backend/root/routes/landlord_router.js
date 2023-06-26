import { 
    createLandlordUser, 
    getLandlordUserByLandlordID,
    getLandlordUsers,
    updateLandlordUser,
    deleteLandlordUser,
    login
}  from "../controller/landlord_controller.js";
import express from "express";
import { checkToken } from "../auth/token_validation.js";
const router = express.Router();

router.post("/", checkToken, createLandlordUser);           // create landlord user
router.get("/", checkToken, getLandlordUsers);              // get all landlord users
router.get("/:id", checkToken, getLandlordUserByLandlordID);    // get landlord user by id
router.patch("/", checkToken, updateLandlordUser);          // update landlord user
router.delete("/", checkToken, deleteLandlordUser);         // delete landlord user
router.post("/login", login);                       // login landlord

export default router;