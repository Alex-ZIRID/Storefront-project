import express, { Request, Response } from "express";
import { UserModel } from "../models/user";
import verifyAuthToken from "../middleware/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const userModel = new UserModel();
const JWT_SECRET = process.env.JWT_SECRET as string;

// **Create User (Register)**
router.post("/register", async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userModel.create(req.body);
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

// **User Authentication (Login)**
router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const authenticatedUser = await userModel.authenticate(email, password);

        if (!authenticatedUser) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ id: authenticatedUser.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ user: authenticatedUser, token });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// **Get All Users (Protected Route)**
router.get("/", verifyAuthToken, async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await userModel.index();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// **Get User By ID (Protected Route)**
router.get("/:id", verifyAuthToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userModel.show(parseInt(req.params.id, 10));
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;