import express from "express";
import { getOrderById, placeOrder } from "../controllers/order.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

const router = express.Router();

router.post("/", protectRoute, placeOrder);
router.get("/:id", protectRoute, validateObjectId("id"), getOrderById);

export default router;
