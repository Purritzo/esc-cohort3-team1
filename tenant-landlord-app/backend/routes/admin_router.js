import {
    controllerCreateLandlord,
    controllerLoginAdmin
  } from "../controller/admin_controller.js";
  import express from "express";
  import { checkToken } from "../auth/token_validation.js";
  import multer from "multer";
  
  
  
  
  
  const router = express.Router();
  
  
  // set storage in disk
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/public/uploads")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname  )
    }
  })
  var upload = multer({ storage: storage })
  
  
  
  
  /**
   * API CALLS
   * 1. Create landlord account
   * 2. Login into landlord account
   * 3. View and update service ticket
   */
  
  // Be wary about the singular/plural of "Ticket"
  router.post("/createLandlord", controllerCreateLandlord);
  router.post("/login", controllerLoginAdmin);

  
  export default router;
  