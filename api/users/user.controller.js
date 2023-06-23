const {
  create,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
} = require("./user.service.js");
const { genSaltSync, hashSync } = require("bcrypt");
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
};
