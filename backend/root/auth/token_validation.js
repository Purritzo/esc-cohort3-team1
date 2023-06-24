/*
================================================================
THIS FILE IS TO CHECK IF THE USER IS A VALID USER.
================================================================
*/

require("dotenv").config()
const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken: (req,res,next) => {
        let token = req.get("authorization");
        if(token) {
            token = token.slice(7);
            verify(token, process.env.PASSWORD_KEY, (err, decoded) => {
                if (err) {
                    res.json({
                        sucess: 0,
                        message: "Invalid token"
                    })
                } else {
                    next();
                }
            })
        } else {
            res.json({
                success: 0,
                message: "Access denied: Unauthorised user"
            });
        }
    }
}