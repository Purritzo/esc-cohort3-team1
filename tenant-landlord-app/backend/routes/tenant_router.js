import {
  controllerLoginTenant,
  controllerGetTickets,
  controllerGetTicketsByStatus,
  controllerCreateTicket,
  controllerQuotationApproval,
  controllerAddFeedbackRating,
  controllerAddFeedbackText,
  controllerCloseTicketStatus,
  controllerForgotPasswordTenant,
  controllerResetPasswordPageTenant,
  controllerResetPasswordTenant,
  controllerGetTicketById,
  controllerGetLeaseByTenant,
  controllerGetQuotation,
  controllerRejectTicketWork
} from "../controller/tenant_controller.js";
import express from "express";
import { checkTenantToken } from "../auth/tenant_validation.js";

const router = express.Router();

/**
 * API CALLS
 * 1. Login into tenant account
 * 2. Create service ticket
 * 3. Approve/Disapprove quotation
 * 4. View tenant's service tickets
 * 5. View tenant's service tickets by status
 * 6. Add Feedback Rating
 * 7. Add Feedback Text
 * 8. Change Ticket Status to close
 */

router.post("/login", controllerLoginTenant);
router.post("/forgot-password", controllerForgotPasswordTenant);
router.post("/reset-password/:id/:jsontoken", controllerResetPasswordTenant);
router.get("/reset-password/:id/:jsontoken", controllerResetPasswordPageTenant);

router.get("/getLease", checkTenantToken, controllerGetLeaseByTenant);

router.get("/getQuotation/", checkTenantToken, controllerGetQuotation);

router.post("/createTicket", checkTenantToken, controllerCreateTicket);
router.patch("/quotationApproval/", checkTenantToken, controllerQuotationApproval);

router.get("/getTickets",checkTenantToken, controllerGetTickets);
router.get("/getTicketById/", checkTenantToken, controllerGetTicketById);
router.get("/getTicketsByStatus/:status",checkTenantToken, controllerGetTicketsByStatus);

router.patch("/addFeedbackRating/", checkTenantToken, controllerAddFeedbackRating);
router.patch("/addFeedbackText/", checkTenantToken, controllerAddFeedbackText);
router.patch("/closeTicketStatus/", checkTenantToken, controllerCloseTicketStatus);

router.patch("/rejectTicketWork/", checkTenantToken, controllerRejectTicketWork)
export default router;