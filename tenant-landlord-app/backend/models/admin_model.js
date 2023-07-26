import { pool } from "../config/database.js";

/**
 * Create admin account
 * @param {*} data email, password(unhashed)
 * @param {*} callBack
 */
export const createAdmin = (data, callBack) => {
  pool.query(
    `
    INSERT INTO ADMIN_USER(email, password)
    VALUES (?, ?)
    `,
    [data.email, data.password],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

/**
 * Get admin with email
 * @param {*} email
 * @param {*} callBack
 */
export const getAdminByEmail = (email, callBack) => {
  pool.query(
    `
    SELECT *
    FROM admin_user
    WHERE email = ?
    `,
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        // console.log(results);
        callBack(null, results[0]);
      }
    }
  );
};

/**
 * Create landlord account
 * @param {*} data email, password(unhashed), ticket_type
 * @param {*} callBack
 */
export const createLandlord = (data, callBack) => {
  pool.query(
    `
    INSERT INTO LANDLORD_USER(email, password, ticket_type)
    VALUES (?, ?, ?)
    `,
    [data.email, data.password, data.ticket_type],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

/**
 * Get landlord with email
 * @param {*} email
 * @param {*} callBack
 */
export const getLandlordByEmail = (email, callBack) => {
  pool.query(
    `
    SELECT *
    FROM landlord_user
    WHERE email = ?
    `,
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
};

/**
 * Delete landlord accounts by email
 * @param {*} email
 * @param {*} callBack
 */
export const deleteLandlordByEmail = (email, callBack) => {
  pool.query(
    "DELETE FROM landlord_user WHERE email = ?",
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};

/**
 * Building Creation
 * @param {*} data public_building_id(RC, FC), building_name, address,postal_code
 * @param {*} callBack
 */
export const createBuilding = (data, callBack) => {
  pool.query(
    `
    INSERT INTO building
    (public_building_id, building_name, address, postal_code)
    VALUES (?,?,?,?)
    `,
    [
      data.public_building_id,
      data.building_name,
      data.address,
      data.postal_code,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        callBack(error);
      } else {
        callBack(null, results);
      }
    }
  );
};
