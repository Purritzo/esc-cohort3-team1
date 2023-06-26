/*
================================================================
THIS FILE ONLY DOES THE QUERY TO DATABASE.
================================================================
*/

import pool from "../database.js";

// create new building
export const createBuilding = (data, callBack) => {

    pool.query(
        `SELECT * FROM building WHERE building_name = ? AND postal_code = ?`,
        [data.building_name, data.postal_code],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            // insert new building if not results
            if (results[0]) {
                console.log(results[0])
                return callBack("Building exists", results[0]);
            } else {
                pool.query(
                    `INSERT INTO building (building_name, postal_code) 
                                        VALUES (?,?)`,
                    [
                        data.building_name,
                        data.postal_code
                    ],
                    (error, results, fields) => {
                        if (error) {
                            return callBack(error);
                        }
                        return callBack(null, results);
                    })
            }
        }
    )
}

// get all building's id, name and postal code
export const getBuildings = callBack => {
    pool.query(
        `SELECT * 
        FROM building`,
        [],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results);
        }
    );
}

// get specific building's name and postal code
export const getBuildingByBuildingID = (id, callBack) => {
    pool.query(
        `SELECT building_name,postal_code 
        FROM building 
        WHERE building_id = ?`,
        [id],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results[0]);
        }
    );
}

// update building details
export const updateBuilding = (data, callBack) => {
    pool.query(
    `UPDATE building 
    SET building_name=?, postal_code=?
    WHERE building_id=?`,
    [
        data.building_name,
        data.postal_code,
        data.building_id
    ],
    (error, results, fields) => {
        if (error) {
            return callBack(error);
        }
        return callBack(null, results);
    })
}

// delete building
export const deleteBuilding = (data, callBack) => {
    pool.query(
        `DELETE FROM building
        WHERE building_id = ?`,
        [data.building_id],
        (error, results, fields) => {
            if (error) {
                return callBack(error);
            }
            return callBack(null, results[0]);
        })
}