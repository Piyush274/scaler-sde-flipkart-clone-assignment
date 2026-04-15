import User from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../lib/utils/jwtSecret.js";

// Supports auth via JWT cookie and keeps x-user-id fallback for tests/tools.
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (token) {
      try {
        const decoded = jwt.verify(token, getJwtSecret());
        const user = await User.findById(decoded.userId);

        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        req.user = user;
        return next();
      } catch (_) {
        return res.status(401).json({ error: "Invalid or expired jwt token." });
      }
    }

    const userId = req.header("x-user-id");
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized. Missing jwt cookie or x-user-id header."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid x-user-id value." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};