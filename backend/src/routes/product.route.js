import express from "express";
import { getProductById, getProducts } from "../controllers/product.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", validateObjectId("id"), getProductById);

export default router;
