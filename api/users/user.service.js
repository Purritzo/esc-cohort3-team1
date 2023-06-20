const pool = require("../../config/database.cjs"); //why not database.js
module.exports = {
  create: (data, callback) => {
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
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
