import pool from "../config/database.js";

export const createLandlord = (data, callBack) => {
  pool.query(
    `
    INSERT INTO LANDLORD_USER(landlord_user_id, building_id, username, password, ticket_type)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.landlord_user_id,
      data.building_id,
      data.username,
      data.password,
      data.ticket_type,
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

export const getLandlordByUsername = (username, callBack) => {
  pool.query(
    `
    SELECT *
    FROM landlord_user
    WHERE username = ?
    `,
    [username],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
};
