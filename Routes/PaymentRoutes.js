import { createPayment, updatePayment, endSubscription } from "../Controllers/PaymentController";
import { protect } from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router.route("/").post(protect, createPayment);
router.route("/:id").put(protect, updatePayment);
router.route("/endSubscription").put(protect, endSubscription);

export default router;
