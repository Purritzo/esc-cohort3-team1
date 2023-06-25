import pool from "../../config/database.js";

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

export const getUsers = (callBack) => {
  pool.query(
    `
    SELECT id, firstName, lastName, gender, email, number
    FROM registration
    `,
    [],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

export const getUserByUserId = (id, callBack) => {
  pool.query(
    `
    SELECT id, firstName, lastName, gender, email, number
    FROM registration
    WHERE id = ?
    `,
    [id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
};

export const updateUser = (data, callBack) => {
  pool.query(
    `
    UPDATE registration
    SET firstName=?, lastName=?, gender=?, email=?, password=?, number=?
    WHERE id = ?
    `,
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
        callBack(null, results[0]);
      }
    }
  );
};

export const deleteUser = (id, callBack) => {
  pool.query(
    `
    DELETE FROM registration
    WHERE id = ?
    `,
    [id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
};

export const getUserByUserEmail = (email, callBack) => {
  pool.query(
    `
    SELECT *
    FROM registration
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
