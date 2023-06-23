const pool = require("../../config/database.cjs"); //why not database.js
module.exports = {
  create: (data, callBack) => {
    pool.query(
      `
        insert into registration(firstName, lastName,gender,email,password,number)
            values(?,?,?,?,?,?)`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
      ],
      (error, results, fields) => {
        //this is part of the syntax of pool.query(sql query, callback(error,results,fields))
        //this is carried out once query is completed. error, results, fields will be provided
        if (error) {
          callBack(error); //This doesnt need a return statement cos we are not returning anything
        }
        return callBack(null, results); // This needs a return to pass something back??
      }
    );
  },
  getUsers: (callBack) => {
    pool.query(
      `select id, firstName, lastName,gender,email,number from registration`,
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    pool.query(
      `select id, firstName, lastName, gender, email,number from registration where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          return callBack(null, results[0]);
        }
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      `update registration set firstName=?, lastName=?, gender=?, email=?, password = ?,number=? where id = ?`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
        data.id,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          return callBack(null, results[0]);
        }
      }
    );
  },
  deleteUser: (id, callBack) => {
    pool.query(
      `delete from registration where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          return callBack(null, results[0]); //why return results[0]?
        }
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `select * from registration where email =?`, //Question, how do i make the emails unique?
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results[0]);
          /**we need to specify results[0] because in login we use results.password to access the pw.
           *If its an array with multiple entry, we cant do that */
        }
      }
    );
  },
};
