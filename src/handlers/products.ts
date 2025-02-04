import express, { Request, Response } from "express";
import { ProductModel } from "../models/product";
import verifyAuthToken from "../middleware/auth";

const router = express.Router();
const productModel = new ProductModel();

// **Get All Products**
router.get("/", async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await productModel.index();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// **Get Product By ID**
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = parseInt(req.params.id, 10);
        const product = await productModel.show(productId);

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// **Create Product (Protected Route)**
router.post("/", verifyAuthToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await productModel.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

export default router;