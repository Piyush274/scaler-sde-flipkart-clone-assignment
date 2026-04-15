import express from "express";
import {
  addToCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.put("/:id", protectRoute, validateObjectId("id"), updateCartItem);
router.delete("/:id", protectRoute, validateObjectId("id"), deleteCartItem);

export default router;
