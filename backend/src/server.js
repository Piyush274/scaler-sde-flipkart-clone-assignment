import express from "express"
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import productRoute from "./routes/product.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import authRoute from "./routes/auth.route.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import dbConnect from "./db/dbConnect.js";

const app = express()
const port = process.env.PORT || 5000

const _dirname = path.resolve(); //We will get direct path of folder


//To get json from frontend through req body
app.use(express.json({limit:"5mb"}))  //Increase limit when payload(data) is large

//If value is too large it can crashed due to denial of service(DOS)

//To get json via form data
app.use(express.urlencoded({extended:true}))

//To get cookies from browser
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/auth", authRoute);

app.use(express.static(path.join(_dirname, "/frontend/dist")));

// Serve frontend app for non-API routes when frontend build exists.
app.get(/^(?!\/api).*/, (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await dbConnect();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });
};

startServer();