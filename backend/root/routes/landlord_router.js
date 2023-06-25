const { 
    createLandlord, 
    getLandlordByLandlordID,
    getLandlords,
    updateLandlord,
    deleteLandlord,
    login
} = require("../controller/landlord_controller");
const router = require("express").Router();
const { checkToken } = require("../auth/token_validation");

router.post("/", checkToken, createLandlord);           // create landlord user
router.get("/", checkToken, getLandlords);              // get all landlord users
router.get("/:id", checkToken, getLandlordByLandlordID);    // get landlord user by id
router.patch("/", checkToken, updateLandlord);          // update landlord user
router.delete("/", checkToken, deleteLandlord);         // delete landlord user
router.post("/login", login);                       // login landlord

module.exports = router;