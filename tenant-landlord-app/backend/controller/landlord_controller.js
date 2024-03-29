import {
  createLandlord,
  getLandlordByEmail,
  createTenant,
  getTickets,
  getTicketById,
  getTicketsByStatus,
  //updateQuotation,
  getLandlordById,
  updateLandlordPassword,
  uploadQuotation,
  // getQuotation,
  getQuotationPath,
  ticketApproval,
  ticketWork,
  getTenantAccounts,
  deleteAllTenants,
  deleteAllLandlords,
  deleteLandlordByEmail,
  deleteTenantByEmail,
  getLandlordUserId,
  createLease,
  //getLeaseByLandlord,
  deleteLease,
  //updateLease,
  getLeaseDetails,
  getBuildingID,
  uploadLease,
  getLeasePath,
  getLandlordAccounts,
  recoverLandlordAccount,
  getTicketsByType,
  assignLandlord,
} from "../models/landlord_model.js";
import {
  recoverTenantAccount,
  getTenantByEmail,
  getTenantUserId,
  updateTenantLease,
} from "../models/tenant_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
//import formidable from 'formidable';
import { send } from "process";

/**
 * Create landlord account and store it in mysql database
 * @param {*} req email, password(unhashed), ticket_type
 * @param {*} res
 */
export const controllerCreateLandlord = (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const ticketType = req.body.ticket_type;
  const role = "staff";
  const user_email = req.body.user_email;

  if (!email || !password || !role || !user_email) {
    return res.json({
      success: 0,
      message: "missing data entry!",
    });
  }

  console.log("user_email", user_email);
  console.log("email", email);
  const salt = genSaltSync(10);
  const password_hashed = hashSync(password, salt);
  //check if email already exist in database,
  //only create new tenant account if the email is unique
  getLandlordByEmail(email, (err, results) => {
    console.log(results);
    if (results.length == 0) {
      console.log("creating landlord");
      //get building id of the user creating this landlord account
      getBuildingID(user_email, (err, results) => {
        if (err) {
          console.log(err);
          return;
        } else {
          console.log(results);
          const public_building_id = results.public_building_id;
          console.log(public_building_id);
          //create landlord account
          createLandlord(
            email,
            password_hashed,
            ticketType,
            public_building_id,
            role,
            (err, results) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              }
              return res.status(200).json({
                success: 1,
                message: "created successfully",
                data: results,
              });
            }
          );
        }
      });
    } else if (results[0].deleted_date != null) {
      // check if this account previously existed but has been soft deleted
      console.log(results);
      const id = results[0].landlord_user_id;
      console.log("recovering");
      console.log("id: ", id);
      //recover landlord account
      recoverLandlordAccount(
        password_hashed,
        ticketType,
        id,
        (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          }
          return res.status(200).json({
            success: 1,
            message: "created successfully",
            data: results,
          });
        }
      );
    } else {
      console.log("landlord creation failed");
      console.log(results);
      return res.status(200).json({
        success: 0,
        message: "Duplicate email entry",
        data: results,
      });
    }
  });
};

/**
 * Login for landlord
 * @param {*} req email
 * @param {*} res
 */
export const controllerLoginLandlord = (req, res) => {
  const body = req.body;
  console.log(body.email);
  getLandlordByEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    } else if (results.length === 0 || results[0].deleted_date != null) {
      return res.json({
        success: 0,
        message: "Invalid email or password",
      });
    } else {
      console.log(body.password, results[0].password);
      const password_check = compareSync(body.password, results[0].password);
      console.log(password_check);
      if (password_check) {
        results[0].password = undefined;
        const jsontoken = jwt.sign({ result: results[0] }, "qwe1234", {
          expiresIn: "1h",
        });
        return res.json({
          success: 1,
          message: "Login successfully",
          token: jsontoken,
          role: results[0].role,
          building: results[0].public_building_id,
        });
      } else {
        console.log(results[0]);
        res.json({
          success: 0,
          message: "Invalid email or password",
        });
      }
    }
  });
};

/**
 * Verify that the landlord account exist in the database through their email,
 * then send the link to their email which will direct them to the reset-password page
 * @param {*} req email
 * @param {*} res
 */
export const controllerForgotPasswordLandlord = (req, res) => {
  const body = req.body;
  console.log(body.email);
  getLandlordByEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "User does not exist!",
      });
    }
    console.log(results[0]);
    //creating the secret key for json token
    const secret = process.env.JWT_SECRET + results[0].password;
    //creating the signature of json token
    const jsontoken = jwt.sign(
      { email: results[0].email, id: results[0].landlord_user_id },
      secret,
      { expiresIn: 300 }
    );
    const link = `http://localhost:5000/api/landlord/reset-password/${results[0].landlord_user_id}/${jsontoken}`;

    ////// NODEMAILER FEATURE ///////
    ///// nodemailer feature starts from here //////
    var transporter = nodemailer.createTransport({
      service: "gmail",
      //sender email and password
      // you can obtain the password in the following steps:
      // 1. Sign in to gmail
      // 2. go to "manage google account"
      // 3. go to "Security"
      // 4. click on "2-step verification"
      // 5. go to "App passwords" and add a password to a "custom name" app
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.AUTH_USER,
      to: results[0].email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.json({
          success: 0,
          message: "Error sending email.",
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          success: 1,
          message: "Reset password link sent to your email.",
        });
      }
    });
    ///// nodemailer feature ends here /////
  });
};

/**
 * Render the reset-password page. Details of landlord is obtained through their id
 * @param {*} req id and jsontoken
 * @param {*} res
 */
export const controllerResetPasswordPageLandlord = async (req, res) => {
  const { id, jsontoken } = req.params;
  console.log(req.params);
  getLandlordById(id, (err, results) => {
    console.log(results);
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "User does not exist!",
      });
    }
    //obtaining the secret key for jwt
    const secret = process.env.JWT_SECRET + results.password;
    try {
      //verifying the json token signature
      const verify = jwt.verify(jsontoken, secret);
      return res.render("ResetPasswordPage", {
        email: verify.email,
        status: "not verified",
      });
    } catch (error) {
      console.log(error);
      res.send("Not Verified!");
    }
  });
};

/**
 * Reset password of landlord. The landlord is accessed in the database using their id
 * @param {*} req landlord_user_id
 * @param {*} res
 */
export const controllerResetPasswordLandlord = async (req, res) => {
  const { id, jsontoken } = req.params;
  console.log({ id, jsontoken });
  var { password, confirmPassword } = req.body;
  console.log({ password, confirmPassword });
  const salt = genSaltSync(10);
  password = hashSync(password, salt);

  getLandlordById(id, (err, results) => {
    console.log(results);
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "User does not exist!",
      });
    }
    const secret = process.env.JWT_SECRET + results.password;
    try {
      const verify = jwt.verify(jsontoken, secret);
      updateLandlordPassword({ password, id }, (err, results) => {
        console.log({ password, id });
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
      });
      res.render("ResetPasswordPage", {
        email: verify.email,
        status: "verified",
      });
    } catch (error) {
      console.log(error);
    }
  });
};

/**
 * Create Tenant Account, check if an account already exist or if it has been deleted.
 * If the account exist, send a message saying that the account exist.
 * If the account has been deleted, recover the account.
 * @param {*} req tenant's email, password(unhashed), landlord's email
 * @param {*} res
 */
export const controllerCreateTenant = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const landlordEmail = req.body.landlordEmail;

  if (!email || !password || !landlordEmail) {
    return res.status(400).json({
      success: 0,
      message: "missing data entry!",
    });
  }
  console.log("landlordEmail", landlordEmail);
  const salt = genSaltSync(10);
  const password_hashed = hashSync(password, salt);
  //check if email already exist in database,
  //only create new tenant account if the email is unique
  getTenantByEmail(email, (err, results) => {
    console.log(results);
    if (results.length == 0) {
      console.log("creating tenant");
      //get building id of landlord
      getBuildingID(landlordEmail, (err, results) => {
        if (err) {
          console.log(err);
          return;
        } else {
          const public_building_id = results.public_building_id;
          console.log(public_building_id);
          //create tenant account
          createTenant(
            email,
            password_hashed,
            public_building_id,
            (err, results) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              }
              return res.status(200).json({
                success: 1,
                message: "created successfully",
                data: results,
              });
            }
          );
        }
      });
    } else if (results[0].deleted_date != null) {
      console.log(results);
      const id = results[0].tenant_user_id;
      console.log("recovering");
      console.log("id: ", id);
      recoverTenantAccount(id, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        return res.status(200).json({
          success: 1,
          message: "created successfully",
          data: results,
        });
      });
    } else {
      console.log("tenant creation failed");
      console.log(results);
      return res.status(200).json({
        success: 0,
        message: "Duplicate email entry",
        data: results,
      });
    }
  });
};

/**
 * delete all tenant accounts with same buildingID as landlord
 * @param {*} req landlordEmail
 * @param {*} res
 */
export const controllerDeleteAllTenants = (req, res) => {
  const { landlordEmail } = req.query;
  if (!landlordEmail) {
    return res.status(400).json({
      success: 0,
      message: "missing data entry!",
    });
  }
  getBuildingID(landlordEmail, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    if (!results) {
      return res.status(400).json({
        success: 0,
        message: "data validation error",
      });
    }
    const buildingID = results.public_building_id;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const deletedDate = String(day) + "-" + String(month) + "-" + String(year);
    deleteAllTenants(deletedDate, buildingID, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "deleted successfully",
      });
    });
  });
};

/**
 * delete all landlord staff accounts with same buildingID as supervisor
 * @param {*} req landlordEmail
 * @param {*} res
 */
export const controllerDeleteAllLandlords = (req, res) => {
  const { landlordEmail } = req.query;
  getBuildingID(landlordEmail, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    const buildingID = results.public_building_id;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const deletedDate = String(day) + "-" + String(month) + "-" + String(year);
    deleteAllLandlords(deletedDate, buildingID, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        message: "deleted successfully",
      });
    });
  });
};

/**
 * delete individual tenant account
 * @param {*} req
 * @param {*} res
 */
export const controllerDeleteTenantByEmail = (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.email) {
    return res.status(400).json({
      message: "missing data entry!",
      success: 0,
    });
  }
  const { email } = body;
  console.log(email);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const deletedDate = String(day) + "-" + String(month) + "-" + String(year);
  deleteTenantByEmail(deletedDate, email, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: 0,
        message: "invalid tenant account",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "deleted successfully",
    });
  });
};

/**
 * delete individual landlord accounts
 * @param {*} req
 * @param {*} res
 */
export const controllerDeleteLandlordByEmail = (req, res) => {
  const body = req.body;
  console.log(body);
  const { email } = body;
  console.log("???", email);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const deletedDate = String(day) + "-" + String(month) + "-" + String(year);
  deleteLandlordByEmail(deletedDate, email, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "deleted successfully",
    });
  });
};

/**
 * Gets tickets requested by tenants under the same building and ticket type as landlord
 * @param {*} req
 * @param {*} res
 * @returns Tickets
 */
export const controllerGetTicketsByType = (req, res) => {
  const { email } = req.query;
  getLandlordByEmail(email, (err, results) => {
    if (err) {
      console.log(err);
      return;
    } else {
      const public_building_id = results[0].public_building_id;
      console.log("building id", public_building_id);
      const ticketType = results[0].ticket_type;
      getTicketsByType(public_building_id, ticketType, (err, results) => {
        console.log(results);
        if (err) {
          console.log(err);
          return;
        } else {
          return res.json({
            success: "1",
            data: results,
          });
        }
      });
    }
  });
};

/**
 * Gets tickets requested by tenants under the same building as landlord
 * Mainly used by landlord supervisors
 * @param {*} req
 * @param {*} res
 * @returns Tickets
 */
export const controllerGetTickets = (req, res) => {
  const { email } = req.query;
  getBuildingID(email, (err, results) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(results);
      const public_building_id = results.public_building_id;
      getTickets(public_building_id, (err, results) => {
        if (err) {
          console.log(err);
          return;
        } else {
          return res.json({
            success: "1",
            data: results,
          });
        }
      });
    }
  });
};

/**
 * Gets ticket by public_service_request_id(YYYY-MM-DD 00:00:00)
 * @param {*} req
 * @param {*} res
 */
export const controllerGetTicketById = (req, res) => {
  const id = req.query.id;
  getTicketById(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (results.length === 0) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    } else {
      return res.json({
        success: "1",
        data: results[0],
      });
    }
  });
};

/**
 * Get Tickets by status, status in params
 * @param {*} req
 * @param {*} res
 */
export const controllerGetTicketsByStatus = (req, res) => {
  const status = req.params.status;
  getTicketsByStatus(status, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: err,
      });
    }
    if (results.length === 0) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    } else {
      return res.json({
        success: "1",
        data: results,
      });
    }
  });
};

/**
 * Landlord updates quotation. params: public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} req  status
 * @param {*} res
 */
// export const controllerUpdateQuotation = (req, res) => {
//   const id = req.params.id;
//   const body = req.body;
//   updateQuotation(id, body, (err, results) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     if (!results) {
//       return res.json({
//         success: 0,
//         message: "Failed to update user",
//       });
//     }
//     return res.status(200).json({
//       success: 1,
//       data: "updated successfully!",
//     });
//   });
// };

/**
 * store quotation in file system and its path in mysql database
 * @param {formData} req
 */
export const controllerUploadQuotation = (req, res) => {
  const id = req.query.ticket_id;
  //console.log(req)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  const files = req.file;

  console.log(files);

  const filepath = files.path;
  console.log(filepath);

  if (!id || !filepath) {
    return res.json({
      success: 0,
      message: "missing data entry!",
    });
  }

  // get quotation's path in file system and store it in mysql database
  uploadQuotation({ filepath, id }, (err, results) => {
    console.log("uploadQuotation results", results);
    if (err) {
      console.log(err);
      return;
    }
    if (results.affectedRows === 0) {
      return res.json({
        success: 0,
        message: "Failed to upload file",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully!",
    });
  });
};

export const controllerGetQuotation = (req, res) => {
  const id = req.query.id;
  console.log("id in controller", id);
  if (!id) {
    return res.send("missing data entry!");
  }
  getQuotationPath(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (results.length === 0) {
      return res.json({
        success: 0,
        message: "service ticket not found",
      });
    } else {
      var filepath = results[0].quotation_path;
      console.log(filepath);
      if (filepath == null) {
        res.send("No quotation uploaded yet!");
        return;
      }
      fs.readFile(filepath, (err, data) => {
        if (err) {
          console.log("error");
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        // Set headers for the response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=file.pdf");
        // Send the PDF file data as the response
        res.send(data);
      });
      if (err) {
        return console.log(err);
      }
    }
  });
};

/**
 * Ticket Approval, public_service_request_id (YYYY-MM-DD 00:00:00) and boolean for if quotation is required in params
 * @param {*} req
 * @param {*} res
 */
export const controllerTicketApproval = (req, res) => {
  const id = req.body.ticket_id;
  console.log(req.body.ticket_id);
  const quotationRequired = req.body.quotation_required;
  console.log(quotationRequired);
  const body = req.body;
  let status;
  console.log("HELLOOOO");
  console.log(body);
  if (!id) {
    return res.json({
      success: 0,
      message: "missing data entry!",
    });
  }
  if (quotationRequired !== 0 && quotationRequired !== 1) {
    console.log("data validation error");
    return res.status(400).json({
      success: 0,
      message: "Data validation error",
    });
  }
  if (
    body.ticket_approved_by_landlord !== 0 &&
    body.ticket_approved_by_landlord !== 1
  ) {
    console.log("data validation error");
    return res.status(400).json({
      success: 0,
      message: "Data validation error",
    });
  }
  if (body.ticket_approved_by_landlord === 1) {
    status = "landlord_ticket_approved";
  } else if (body.ticket_approved_by_landlord === 0) {
    status = "landlord_ticket_rejected";
  }

  ticketApproval(id, quotationRequired, status, (err, results) => {
    if (err) {
      console.log(err);
      return res.json({
        success: 0,
        message: `${err}`,
      });
    }
    if (results.changedRows === 0) {
      return res.json({
        success: 0,
        message: "Failed to update user",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully",
    });
  });
};

/**
 * params: public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} req
 * @param {*} res
 */
export const controllerTicketWork = (req, res) => {
  const id = req.body.ticket_id;
  console.log(id);
  let status;
  if (req.body.ticket_work_status !== 0 && req.body.ticket_work_status !== 1) {
    return res.status(400).json({
      success: 0,
      message: "Data validation error",
    });
  }
  if (req.body.ticket_work_status === 1) {
    status = "landlord_started_work";
  } else if (req.body.ticket_work_status === 0) {
    status = "landlord_completed_work";
  }

  ticketWork(id, status, (err, results) => {
    if (err) {
      return res.json({
        success: 0,
        message: err,
      });
    }
    if (results.changedRows === 0) {
      return res.json({
        success: 0,
        message: "Failed to update user",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully",
    });
  });
};

/**
 * get all tenant accounts under the same building as landlord
 * @param {*} req
 * @param {*} res
 */
export const controllerGetTenantAccounts = (req, res) => {
  const query = req.query;
  const { landlordEmail } = query;
  // console.log("email", landlordEmail);
  getBuildingID(landlordEmail, (err, results) => {
    if (err) {
      return res.json({
        success: 0,
        message: err,
      });
    } else if (!results) {
      return res.status(400).json({
        success: 0,
        message: "invalid landlord email",
      });
    } else {
      console.log(results);
      const public_building_id = results.public_building_id;
      // console.log(public_building_id)
      getTenantAccounts(public_building_id, (err, results) => {
        // console.log(results);
        if (err) {
          console.log(err);
          return;
        } else {
          return res.json({
            success: "1",
            data: results,
          });
        }
      });
    }
  });
};

/**
 * get all landlord staff accounts under the same building as the landlord supervisor
 * @param {*} req
 * @param {*} res
 */
export const controllerGetLandlordAccounts = (req, res) => {
  const query = req.query;
  const { landlordEmail, ticket_type } = query;
  console.log("email", landlordEmail);
  console.log(ticket_type);
  getLandlordByEmail(landlordEmail, (err, results) => {
    console.log(results);
    if (err) {
      console.log(err);
      return;
    } else {
      const public_building_id = results[0].public_building_id;
      // console.log(public_building_id)
      getLandlordAccounts(public_building_id, ticket_type, (err, results) => {
        if (err) {
          console.log(err);
          return;
        } else {
          return res.json({
            success: "1",
            data: results,
          });
        }
      });
    }
  });
};

/**
 * get the details of a landlord
 * @param {*} req email
 * @param {*} res
 */
export const controllerGetLandlordDetails = (req, res) => {
  const query = req.query;
  const { landlordEmail } = query;
  console.log("email", landlordEmail);
  getLandlordByEmail(landlordEmail, (err, results) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(results[0]);
      return res.json({
        success: "1",
        data: results[0],
      });
    }
  });
};

/**
 * store lease in file system and its path in mysql database
 * @param {formData} req
 */
export const controllerUploadLease = (req, res) => {
  const id = req.params.id;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");

  const files = req.file;
  console.log(files);
  const filepath = files.path;
  console.log(filepath);
  const floor = req.body.floor;
  const unit_number = req.body.unit_number;
  console.log(floor);
  console.log(unit_number);

  // get quotation's path in file system and store it in mysql database
  uploadLease({ filepath, id }, (err, results) => {
    console.log("uploadLease results", results);
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Failed to upload file",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully!",
    });
  });
};

/**
 * get tenant's current lease
 * @param {\} req
 * @param {*} res
 */
export const controllerGetLease = (req, res) => {
  const query = req.query;
  console.log(query);
  const { tenantID } = query;
  console.log("tenantID: ", tenantID);
  if (!tenantID) {
    return res.json({
      success: 0,
      message: "missing data entry!",
    });
  }
  getLeasePath(tenantID, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (results.length === 0) {
      return res.json({
        success: 0,
        message: "tenant user not found",
      });
    } else {
      var filepath = results[0].pdf_path;
      console.log(filepath);
      if (filepath == null) {
        res.send("No lease uploaded yet!");
        return;
      }
      fs.readFile(filepath, (err, data) => {
        if (err) {
          console.log("error");
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        // Set headers for the response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=file.pdf");
        // Send the PDF file data as the response
        res.send(data);
      });
    }
  });
};

/**
 *
 * @param {object} req
 * {
 * landlord_email,
 * tenant_email,
 * public_lease_id,
 * floor,
 * unit_number,
 * pdf_path
 * }
 * @param {json} res
 */
export const controllerCreateLease = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");

  const files = req.file;
  console.log(files);
  const filepath = files.path;
  const floor = req.body.floor;
  const unit_number = req.body.unit_number;
  const landlordEmail = req.body.landlordEmail;
  const tenantID = req.body.tenantID;
  console.log("landlordEmail", landlordEmail);
  console.log("tenantID", tenantID);
  console.log("floor", floor);
  console.log("unit_number", unit_number);

  if (!floor || !unit_number || !landlordEmail || !tenantID) {
    return res.json({
      success: 0,
      message: "missing data entry!",
    });
  }

  getLandlordUserId(landlordEmail, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (results.length === 0) {
      return res.json({
        success: 0,
        message: "landlord not registered.",
      });
    } else {
      const landlordID = results[0].landlord_user_id;
      console.log("landlordID", landlordID);
      const publicLeaseID = String(Date.now());
      createLease(
        publicLeaseID,
        landlordID,
        tenantID,
        req.body,
        (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection error",
            });
          } else {
            // get lease's path in file system and store it in mysql database
            uploadLease({ filepath, publicLeaseID }, (err, results) => {
              console.log("uploadLease results", results);
              if (err) {
                console.log(err);
                return;
              }
            });
            updateTenantLease(publicLeaseID, tenantID, (err, results) => {
              console.log(publicLeaseID);
              console.log(tenantID);
              if (err) {
                console.log(err);
                return res.status(500).json({
                  success: 0,
                  message: "Database connection error",
                });
              } else {
                return res.status(200).json({
                  success: 1,
                  message: "updated successfully!",
                });
              }
            });
          }
        }
      );
    }
  });
};

/**
 *
 * @param {object} req
 * {email}
 * @param {json} res
 */
// export const controllerGetLeaseByLandlord = (req,res) => {
//   let landlordID = "";
//   getLandlordUserId(req.body.email, (err, results) => {
//     if (err) {
//       console.log(err)
//       return
//     } if (!results) {
//       return res.json({
//         success:0,
//         message: "landlord not registered."
//       })
//     } else {
//       landlordID = results.landlord_user_id;
//       // console.log(landlordID)
//       getLeaseByLandlord(landlordID, (err, results) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({
//             success: 0,
//             message: "Database connection error"
//           });
//         } else {
//           return res.status(200).json({
//             success:1,
//             data: results
//           });
//         };
//       })
//     }
//   })
// }

export const controllerDeleteLease = (req, res) => {
  if (!req.body.public_lease_id) {
    return res.status(400).json({
      success: 0,
      message: "missing data entry!",
    });
  }
  deleteLease(req.body.public_lease_id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "deleted successfully",
    });
  });
};

// export const controllerUpdateLease = (req, res) => {
//   let landlordID = "";
//   let tenantID = "";
//   getLandlordUserId(req.body.landlord_email, (err,results) => {
//     if (err) {
//       console.log(err);
//       return;
//     } if (!results) {
//       return res.json({
//         success : 0,
//         message: "landlord not registered."
//       })
//     } else {
//       landlordID = results.landlord_user_id;
//       // console.log(landlordID)
//       getTenantUserId(req.body.tenant_email, (err, results) => {
//         if (err) {
//           console.log(err)
//           return
//         } if (!results) {
//           return res.json({
//             success:0,
//             message: "tenant not registered."
//           })
//         } else {
//           tenantID = results.tenant_user_id;
//           // console.log(tenantID)
//           updateLease(landlordID, tenantID, req.body, (err, results) => {
//             if (err) {
//               console.log(err);
//               return res.status(500).json({
//                 success: 0,
//                 message: "Database connection error"
//               });
//             } else {
//               updateTenantLease(req.body.tenant_email,req.body.new_public_lease_id, (err,results) => {
//                 if (err) {
//                   console.log(err);
//                   return res.status(500).json({
//                     success: 0,
//                     message: "Database connection error"
//                   })
//                 }
//               });
//               return res.status(200).json({
//                 success:1,
//                 data: results
//               });
//             };
//           })
//         }
//       })
//     }
//   })
// }

export const controllerGetLeaseDetails = (req, res) => {
  const query = req.query;
  console.log("req query", req.query);
  const tenantUserId = query.id;
  console.log("user id", tenantUserId);
  getLeaseDetails(tenantUserId, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "successfully retrieve lease details",
      data: results,
    });
  });
};

export const controllerAssignLandlord = (req, res) => {
  const { landlordEmail, ticketID } = req.query;
  console.log("landlord email", landlordEmail);
  console.log("ticket id", ticketID);
  assignLandlord(landlordEmail, ticketID, (err, results) => {
    console.log("landlord assigned", results);
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "successfully assigned landlord",
      data: results,
    });
  });
};
