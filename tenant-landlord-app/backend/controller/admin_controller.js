import {
    createLandlord,
    getAdminByEmail,

  
  } from "../models/admin_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import formidable from 'formidable';
import { send } from "process";
  
  
/**
 * Create landlord account
 * @param {*} req email, password(unhashed), ticket_type
 * @param {*} res 
 */
export const controllerCreateLandlord = (req, res) => {
const body = req.body;
createLandlord(body, (err, result) => {
    if (!result) {
    console.log(body);
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    createLandlord(body, (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).json({
            success: 0,
            message: "Database connection error",
        });
        }
        return res.status(200).json({
        success: 1,
        message: "created successfully",
        data: results,
        });
    });
    }
    else {
    return res.status(500).json({
    success: 0,
    message: "duplicate email",

    });}
})

};


  /**
 * Login for Admin
 * @param {*} req Admin email
 * @param {*} res 
 */
export const controllerLoginAdmin = (req, res) => {
    const body = req.body;
    console.log(body.email);
    getAdminByEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
      console.log(body.password, results.password);
      const password_check = compareSync(body.password, results.password);
      console.log(password_check);
      if (password_check) {
        results.password = undefined;
        const jsontoken = jwt.sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "Login successfully",
          token: jsontoken,
        });
      } else {
        console.log(results);
        res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
    });
  };