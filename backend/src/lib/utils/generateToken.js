import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwtSecret.js";

//Generate a token and set it as a cookie and save it to the browser

export const generateTokenAndSetCookie=(userId,res)=>{
    //from response object res.cookie is used
    
    const token=jwt.sign({userId},getJwtSecret(),{expiresIn:"15d"})
    //Created a token  with payload UserId and ecoded with JWT secret  
    
    // Send as cookie to frontend browser and store it
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // In milliseconds
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });

    return token;
}

