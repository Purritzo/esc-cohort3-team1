const {
  create,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  getUserByUserEmail,
} = require("./user.service.js");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
//Create Json web token
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    console.log(body);
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection errror",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
      //I'm passing this (err, results) as a callback in user.service.
      // In user.servce: if (error), callBack (error) is the same as (err, results)(error) i think?
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
          sucess: "1",
          data: results,
        });
      }
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      //I'm passing this (err, results) as a callback in user.service.
      // In user.servce: if (error), callBack (error) is the same as (err, results)(error) i think?
      if (err) {
        console.log(err);
        return;
      } else {
        return res.json({
          sucess: "1",
          data: results,
        });
      }
    });
  },
  updateUser: (req, res) => {
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
        data: "updated succesfully!",
      });
    });
  },
  deleteUser: (req, res) => {
    const id = req.body.id; //why req.body instead of req.params.id? its up to u
    deleteUser(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        /**if (!results) {
        return res.json({
          success: 0,
          message: "Record not found",
        });
        
      } */
        return res.json({
          sucess: "1",
          message: "Deleted successfully",
        });
      }
    });
  },

  //LOGIN CONTROLLER
  login: (req, res) => {
    const body = req.body; //user will pass email and password
    getUserByUserEmail(body.email, (err, results) => {
      //results is one row of entry
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password ",
        });
      }

      // Email is found via getUserByUserEmail. I check if passwork matches
      const password_check = compareSync(body.password, results.password); //this is boolean variable
      if (password_check) {
        results.password = undefined; //Because I dont want to pass the password to the webtoken
        /**sign takes in 3 parameters
         * First, the object which we want to create jsonwebtoken. Object in Javascript are in key-value pairs
         *    Results is obtained from getUserByUserEmail in user.service.js.
         *    Example - result: {"firstName":"Carina", "lastName": "Chu", "gender": "f", "email": "test@gmail.com", "password":"somehash"}
         * Second, is the secret key (should put this in .env)
         * Third, supplementatry information
         */
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "Login successfully",
          token: jsontoken,
        });

        // Password doesn't match:
      } else {
        res.json({
          success: 0,
          data: "Invalid email or password",
        });
      }
    });
  },
};
