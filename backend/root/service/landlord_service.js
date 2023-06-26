/*
================================================================
THIS FILE ONLY DOES THE QUERY TO DATABASE.
================================================================
*/

import pool from "../database.js";

// register new landlord user
export const createLandlord = (data, callBack) => {

    pool.query(
    `INSERT INTO landlord_user (building_id, username, email, password, ticket_type) 
                        VALUES (?,?,?,?,?)`,
    [
        data.building_id,
        data.username,
        data.email,
        data.password1,
        data.ticket_type
    ],
    (error, results, fields) => {
        if (error) {
            return callBack(error);
        }
        return callBack(null, results);
    })
}

// get all landlord users' username and ticket_type
export const getLandlords = callBack => {
    pool.query(
        `SELECT landlord_user_id,username,email,ticket_type 
        FROM landlord_user`,
        [],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results);
        }
    );
}

// get specific landlord user's username and ticket_type
export const getLandlordByLandlordID = (id, callBack) => {
    pool.query(
        `SELECT landlord_user_id,username,email,ticket_type 
        FROM landlord_user 
        WHERE landlord_user_id = ?`,
        [id],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results[0]);
        }
    );
}

// update landlord user account
export const updateLandlord = (data, callBack) => {
    pool.query(
    `UPDATE landlord_user 
    SET building_id=2, username=?, email=?, password=?, ticket_type=?
    WHERE landlord_user_id=?`,
    [
        data.username,
        data.email,
        data.password,
        data.ticket_type,
        data.landlord_user_id
    ],
    (error, results, fields) => {
        if (error) {
            return callBack(error);
        }
        return callBack(null, results);
    })
}

// delete landlord user
export const deleteLandlord = (data, callBack) => {
    pool.query(
        `DELETE FROM landlord_user
        WHERE landlord_user_id = ?`,
        [data.landlord_user_id],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results[0]);
        })
}

// get specific landlord user's username and ticket_type
export const getLandlordByLandlordUsername = (username, callBack) => {
    pool.query(
        `SELECT *
        FROM landlord_user 
        WHERE username=?`,
        [username],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            //console.log(results)
            return callBack(null, results[0]);
        }
    );
}