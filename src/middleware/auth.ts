import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string; // Ensure JWT Secret is loaded


declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload; // Attach JWT payload to request
        }
    }
}

// Middleware to verify JWT authentication
const verifyAuthToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: "Access denied, token missing" });
            return;
        }

        const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        req.user = decoded; // decoded user data for user authorization in protected routes

        next(); 
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

export default verifyAuthToken;