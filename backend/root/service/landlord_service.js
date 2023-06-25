/*
================================================================
THIS FILE ONLY DOES THE QUERY TO DATABASE.
================================================================
*/

const pool = require("../database.js");

module.exports = {

    // register new landlord user
    createLandlord: (data, callBack) => {

        pool.query(
        `INSERT INTO landlord_user (building_id, username, password, ticket_type) 
                            VALUES (?,?,?,?)`,
        [
            data.building_id,
            data.username,
            data.password1,
            data.ticket_type
        ],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results);
        })
    },

    // get all landlord users' username and ticket_type
    getLandlords: callBack => {
        pool.query(
            `SELECT landlord_user_id,username,ticket_type 
            FROM landlord_user`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },

    // get specific landlord user's username and ticket_type
    getLandlordByLandlordID: (id, callBack) => {
        pool.query(
            `SELECT landlord_user_id,username,ticket_type 
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
    },

    // update landlord user account
    updateLandlord: (data, callBack) => {
        pool.query(
        `UPDATE landlord_user 
        SET building_id=2, username=?, password=?, ticket_type=?
        WHERE landlord_user_id=?`,
        [
            data.username,
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
    },

    // delete landlord user
    deleteLandlord: (data, callBack) => {
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
    },

    // get specific landlord user's username and ticket_type
    getLandlordByLandlordUsername: (username, callBack) => {
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

};