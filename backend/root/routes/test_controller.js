/*
================================================================
THIS FILE TAKES IN DATA FROM FRONTEND, PROCESS THE DATA IF NEEDED,
AND PASS IT ON TO SERVICE WHICH DOES THE QUERY TO DATABASE.
================================================================
createUser 
Require: 
    username (username)
    password1 (first input of password)
    password2 (to check correct password)
    ticket_type (to indicate which service ticket landlord is in charge of)
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {"fieldCount": , "affectedRows": , "insertedID": , "info": , "serverStatus": , "warningStatus":} } if successful

getUserByUserId 
Require:
    landlord_user_id from params
        e.g. http://localhost/3000/routes/1
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {"landlord_user_id": , "username": , "ticket_type": } } if successful

getUsers 
Require:
    does not require anything
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 1, data: {[{"landlord_user_id": , "username": , "ticket_type": }, ... ] } if successful

updateUser 
Require:
    landlord_user_id
    username (username)
    password (first input of password)
    ticket_type (to indicate which service ticket landlord is in charge of)
Returns json:
    {success: 0, message: "<error message>"} if error
    {success: 0, data: "update successfully" }

deleteUser 
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
require("dotenv").config()

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { 
    create, 
    getUserByUserID, 
    getUsers, 
    updateUser,
    deleteUser,
    getUserByUserUsername
} = require("./test_service");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        if (body.password1 == body.password2) {
            const salt = genSaltSync(10);
            body.password1 = hashSync(body.password1, salt);
            create(body, (err, results) => {
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
        } else {
            return res.status(500).json({
                success: 0,
                message: "Passwords are not the same"
            })
        }
    },

    getUserByUserId: (req, res) => {
        const id = req.params.id;
        getUserByUserID(id, (err, result) => {
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

    getUsers: (req, res) => {
        getUsers((err, results) => {
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

    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
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

    deleteUser: (req,res) => {
        const data = req.body;
        deleteUser(data, (err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            return res.json({
                success: 1,
                message: "User has been deleted successfully"
            });
        });
    },

    login: (req, res) => {
        const body = req.body;
        getUserByUserUsername(body.username, (err, results) => {
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
                const jsontoken = sign( { result: results }, process.env.PASSWORD_KEY, {
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
};