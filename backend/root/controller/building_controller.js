/*
================================================================
THIS FILE TAKES IN DATA FROM FRONTEND, PROCESS THE DATA IF NEEDED,
AND PASS IT ON TO SERVICE WHICH DOES THE QUERY TO DATABASE.
================================================================
createBuilding 
Require: 
    building_name
    postal_cose
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {"fieldCount": , "affectedRows": , "insertedID": , "info": , "serverStatus": , "warningStatus":} } if successful

getBuildingByBuildingID 
Require:
    building_id from params
        e.g. http://localhost/3000/routes/building/1
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: { "building_name": , "postal_code": } } if successful

getBuildings 
Require:
    does not require anything
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {[{"building_id": , "building_name": , "postal_code": }, ... ] } if successful

updateBuilding 
Require:
    building_id
    building_name
    postal_code
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 0, data: "update successfully" }

deleteBuilding 
Require:
    building_id
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, message: "User has been deleted successfully" } if successful
*/
const { 
    createBuilding,
    getBuildings,
    getBuildingByBuildingID,
    updateBuilding,
    deleteBuilding
} = require("../service/building_service");

module.exports = {
    createBuilding: (req, res) => {
        const body = req.body;
        createBuilding(body, (err, results) => {
            if (err === "Building exists") {
                return res.status(500).json({
                    success: 0 ,
                    message: "Building exists"
                });
            } else if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0 ,
                    message: "Database connection error"
                });
            } 
            return res.status(200).json({
                success: 1,
                data: results
                });
            });
    },

    getBuildingByBuildingID: (req, res) => {
        const id = req.params.id;
        getBuildingByBuildingID(id, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!result) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                });
            }
            return res.json({
                success: 1,
                data: result
            });
        });
    },

    getBuildings: (req, res) => {
        getBuildings((err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Record not found"
                });
            }
            return res.json({
                success: 1,
                data: results
            })
        })
    },

    updateBuilding: (req, res) => {
        const body = req.body;
        updateBuilding(body, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0 ,
                    message: "Database connection error"
                });
            }
            if (!results) {
                return res.json({
                    success: 0,
                    message: "Failed to update user"
                })
            }
            return res.status(200).json({
                success: 1,
                data: "update successfully"
            });
        });
    },

    deleteBuilding: (req,res) => {
        const data = req.body;
        deleteBuilding(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                message: "User has been deleted successfully"
            });
        });
    }
};