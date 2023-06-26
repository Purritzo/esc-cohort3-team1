import { 
    createBuildingEntry,
    getBuildingEntries,
    getBuildingEntryByBuildingID,
    updateBuildingEntry,
    deleteBuildingEntry
}  from "../controller/building_controller.js";
import express from "express";
const router = express.Router();

router.post("/", createBuildingEntry);           // create building
router.get("/", getBuildingEntries);              // get all buildings
router.get("/:id", getBuildingEntryByBuildingID);    // get building user by id
router.patch("/", updateBuildingEntry);          // update building
router.delete("/", deleteBuildingEntry);         // delete building

export default router;