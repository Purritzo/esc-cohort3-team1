import pool from "../config/database.js";

export const createLandlord = (data, callBack) => {
  pool.query(
    `
    INSERT INTO LANDLORD_USER(landlord_user_id, building_id, email, password, ticket_type)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.landlord_user_id,
      data.building_id,
      data.email,
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

export const getTickets = (callBack) => {
  pool.query(
    `
    SELECT * FROM SERVICE_REQUEST`,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

export const getTicketById = (id, callBack) => {
  pool.query(
    `
    SELECT * FROM SERVICE_REQUEST
    WHERE service_request_id = ?
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

export const getTicketsByStatus = (status, callBack) => {
  pool.query(
    `
    SELECT * FROM SERVICE_REQUEST
    WHERE status = ?
    `,
    [status],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results);
      }
    }
  );
};
