import express from "express";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

const router = express.Router();

router.get("/test-login", async (_, res, next) => {
  try {
    const testEmail = process.env.TEST_USER_EMAIL || "customer1@chatalaxy.com";
    const testName = process.env.TEST_USER_NAME || "Customer One";

    let user = await User.findOne({ email: testEmail });
    if (!user) {
      user = await User.create({
        name: testName,
        email: testEmail
      });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Test login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
