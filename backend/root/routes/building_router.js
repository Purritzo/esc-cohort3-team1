const { 
    createBuilding,
    getBuildings,
    getBuildingByBuildingID,
    updateBuilding,
    deleteBuilding
} = require("../controller/building_controller");
const router = require("express").Router();

router.post("/", createBuilding);           // create building
router.get("/", getBuildings);              // get all buildings
router.get("/:id", getBuildingByBuildingID);    // get building user by id
router.patch("/", updateBuilding);          // update building
router.delete("/", deleteBuilding);         // delete building

module.exports = router;