import {
  createLandlord,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  getUserByUserEmail,
} from "../models/user_service.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

export const controllerCreateLandlord = (req, res) => {
  const body = req.body;
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
      data: results,
    });
  });
};

export const controllerGetUserByUserId = (req, res) => {
  const id = req.params.id;
  getUserByUserId(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    } else {
      return res.json({
        success: "1",
        data: results,
      });
    }
  });
};

export const controllerGetUsers = (req, res) => {
  getUsers((err, results) => {
    if (err) {
      console.log(err);
      return;
    } else {
      return res.json({
        success: "1",
        data: results,
      });
    }
  });
};

export const controllerUpdateUser = (req, res) => {
  const body = req.body;
  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  updateUser(body, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Failed to update user",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully!",
    });
  });
};

export const controllerDeleteUser = (req, res) => {
  const id = req.body.id;
  deleteUser(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    } else {
      return res.json({
        success: "1",
        message: "Deleted successfully",
      });
    }
  });
};

export const controllerLogin = (req, res) => {
  const body = req.body;
  getUserByUserEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        data: "Invalid email or password",
      });
    }

    const password_check = compareSync(body.password, results.password);
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
      res.json({
        success: 0,
        data: "Invalid email or password",
      });
    }
  });
};
