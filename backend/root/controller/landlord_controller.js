/*
================================================================
THIS FILE TAKES IN DATA FROM FRONTEND, PROCESS THE DATA IF NEEDED,
AND PASS IT ON TO SERVICE WHICH DOES THE QUERY TO DATABASE.
================================================================
createLandlord 
Require: 
    username (username)
    email
    password1 (first input of password)
    password2 (to check correct password)
    ticket_type (to indicate which service ticket landlord is in charge of)
    building_name (to create/get building_id)
    postal_code (postal code of building for creation/double checking)
    building_id = "" (set to empty string)
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {"fieldCount": , "affectedRows": , "insertedID": , "info": , "serverStatus": , "warningStatus":} } if successful

getLandlordByLandlordID 
Require:
    landlord_user_id from params
        e.g. http://localhost/3000/routes/landlord/1
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {"landlord_user_id": , "username": , "email": , "ticket_type": } } if successful

getLandlords 
Require:
    does not require anything
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {[{"landlord_user_id": , "username": , "email" : ,  "ticket_type": }, ... ] } if successful

updateLandlord 
Require:
    landlord_user_id
    username (username)
    email
    password (first input of password)
    ticket_type (to indicate which service ticket landlord is in charge of)
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 0, data: "update successfully" }

deleteLandlord 
Require:
    landlord_user_id
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, message: "User has been deleted successfully" } if successful

login 
Require:
    username
    password
    Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, message: "login successfully", "token": } if successful

*/

import dotenv from "dotenv";
dotenv.config();

import { genSaltSync, hashSync, compareSync }  from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { 
    createLandlord, 
    getLandlordByLandlordID, 
    getLandlords, 
    updateLandlord,
    deleteLandlord,
    getLandlordByLandlordUsername
} from "../service/landlord_service.js";
import {
    createBuilding
} from "../service/building_service.js";

export const createLandlordUser = (req, res) => {
    const body = req.body;
    if (body.password1 == body.password2) {

        createBuilding(body, (err,results) => {
            if (err === "Building exists") {
                //console.log("building exists -- controller")
                //console.log(results)
                body.building_id = results.building_id
            } else if (!err) {
                //console.log("building inserted -- controller")
                //console.log(results)
                body.building_id = results.insertId
            }

            const salt = genSaltSync(10);
            body.password1 = hashSync(body.password1, salt);
            createLandlord(body, (err, results) => {
                if (err) {
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
        });

    } else {
        return res.status(500).json({
            success: 0,
            message: "Passwords are not the same"
        })
    }
}

export const getLandlordUserByLandlordID = (req, res) => {
    const id = req.params.id;
    getLandlordByLandlordID(id, (err, result) => {
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
}

export const getLandlordUsers = (req, res) => {
    getLandlords((err, results) => {
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
}

export const updateLandlordUser = (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateLandlord(body, (err, results) => {
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
}

export const deleteLandlordUser = (req,res) => {
    const data = req.body;
    deleteLandlord(data, (err, results) => {
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

export const login = (req, res) => {
    const body = req.body;
    getLandlordByLandlordUsername(body.username, (err, results) => {
        if (err) {
            console.log(err);
        }
        if (!results) {
            return res.json({
                success: 0,
                data: "Invalid username"
            });
        }
        const result = compareSync(body.password,results.password);
        if (result) {
            results.password = undefined;
            const jsontoken = sign( 
                { result: results }, 
                process.env.PASSWORD_KEY, 
                {
                    expiresIn: "1h"
                });
            return res.json({
                success: 1,
                message: "login successfully",
                token: jsontoken
            });
        } else {
            return res.json({
                success: 0,
                data: "Invalid password"
            })
        }
    });
}