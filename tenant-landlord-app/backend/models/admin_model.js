import { pool } from "../config/database.js";

/**
 * Create admin account
 * @param {*} data email, password(unhashed)
 * @param {*} callBack
 */
 export const createAdmin = (data, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          INSERT INTO ADMIN_USER(email, password)
          VALUES (?, ?)
          `,
          [data.email, data.password],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

  export const getAdminById = (id, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          SELECT *
          FROM admin_user
          WHERE admin_user_id = ?
          `,
          [id],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results[0]);
            });
          }
        );
      });
    });
  };
  

/**
 * Get admin with email
 * @param {*} email
 * @param {*} callBack
 */
 export const getAdminByEmail = (email, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          SELECT *
          FROM admin_user
          WHERE email = ?
          `,
          [email],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results[0]);
            });
          }
        );
      });
    });
  };
  

  export const updateAdminPassword = ({ password, id }, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          UPDATE admin_user 
          SET password = ? 
          WHERE admin_user_id = ?
          `,
          [password, id],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

/**
 * Create landlord account
 * @param {*} data email, password(unhashed), ticket_type
 * @param {*} callBack
 */
 export const createLandlord = (data, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          INSERT INTO LANDLORD_USER(email, password, ticket_type, public_building_id, role)
          VALUES (?, ?, ?, ?, ?)
          `,
          [data.email, data.password, data.ticket_type, data.public_building_id, data.role],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

/**
 * Get landlord with email
 * @param {*} email
 * @param {*} callBack
 */
 export const getLandlordByEmail = (email, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          SELECT *
          FROM landlord_user
          WHERE email = ?
          `,
          [email],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results[0]);
            });
          }
        );
      });
    });
  };
  

/**
 * Delete landlord accounts by email
 * @param {*} email
 * @param {*} callBack
 */
 export const deleteLandlordByEmail = (email, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          "DELETE FROM landlord_user WHERE email = ?",
          [email],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

/**
 * Building Creation
 * @param {*} data public_building_id(RC, FC), building_name, address,postal_code
 * @param {*} callBack
 */
 export const createBuilding = (data, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
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
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

  export const getAllTickets = (callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          SELECT *
          FROM service_request
          `,
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

  export const getAllTenantAccounts = (callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        let sqlQuery = `
          SELECT *
          FROM tenant_user
          WHERE deleted_date IS NULL 
        `;
  
        connection.query(
          sqlQuery,
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

  export const getAllLandlordAccounts = (callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        let sqlQuery = `
          SELECT *
          FROM landlord_user
          WHERE deleted_date IS NULL
        `;
  
        connection.query(
          sqlQuery,
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  


/**
 * recover landlord account by setting the deleted_date to NULL
 * @param {*} id 
 * @param {*} callBack 
 */
 export const recoverLandlordAccount = (data, id, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          UPDATE landlord_user 
          SET deleted_date = NULL, password = ?, ticket_type = ?, public_building_id = ?, role = ?
          WHERE landlord_user_id = ?
          `,
          [
            data.password,
            data.ticket_type,
            data.public_building_id,
            data.role,
            id
          ],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

  export const modifyTicket = (data, callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        connection.query(
          `
          UPDATE service_request
          SET ticket_type = ?, request_description = ?, status = ?
          WHERE public_service_request_id = ?
          `,
          [
            data.ticket_type,
            data.request_description,
            data.status,
            data.public_service_request_id
          ],
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  

  export const getBuildings = (callBack) => {
    pool.getConnection((getConnectionErr, connection) => {
      if (getConnectionErr) {
        callBack(getConnectionErr);
        return;
      }
  
      connection.beginTransaction((beginTransactionErr) => {
        if (beginTransactionErr) {
          connection.release();
          callBack(beginTransactionErr);
          return;
        }
  
        let sqlQuery = `
          SELECT *
          FROM building
        `;
  
        connection.query(
          sqlQuery,
          (error, results, fields) => {
            if (error) {
              connection.rollback(() => {
                connection.release();
                callBack(error);
              });
              return;
            }
  
            connection.commit((commitErr) => {
              if (commitErr) {
                connection.rollback(() => {
                  connection.release();
                  callBack(commitErr);
                });
                return;
              }
  
              connection.release();
              callBack(null, results);
            });
          }
        );
      });
    });
  };
  