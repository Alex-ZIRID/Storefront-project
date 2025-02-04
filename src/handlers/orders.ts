import express, { Request, Response } from "express";
import { OrderModel } from "../models/order";
import verifyAuthToken from "../middleware/auth";

const router = express.Router();
const orderModel = new OrderModel();

// **Get Current Order by User (Protected Route)**
router.get("/current/:user_id", verifyAuthToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.user_id, 10);
        const orders = await orderModel.getActiveOrdersByUser(userId);

        if (!orders.length) {
            res.status(404).json({ error: "No active orders found for this user" });
            return;
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// **Create an Order (Protected Route)**
router.post("/", verifyAuthToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const order = await orderModel.create(req.body);
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

// **Add Product to an Order (Protected Route)**
router.post("/:order_id/products", verifyAuthToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = parseInt(req.params.order_id, 10);
        const { product_id, quantity } = req.body;

        if (!product_id || !quantity) {
            res.status(400).json({ error: "Product ID and quantity are required" });
            return;
        }

        const addedProduct = await orderModel.addProductToOrder(orderId, product_id, quantity);

        res.status(201).json({
            message: "Product added to order successfully",
            addedProduct,
        });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;