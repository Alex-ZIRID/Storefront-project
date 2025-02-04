import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Import Handlers
import productRoutes from "./handlers/products";
import userRoutes from "./handlers/users";
import orderRoutes from "./handlers/orders";

dotenv.config(); // Load environment variables

const app: express.Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 3000;

app.use(bodyParser.json());


//  Logging Middleware
app.use((req: Request, res: Response, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

// Root Route
app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World!");
});

// Prevent server from restarting when imported for testing
if (require.main === module) {
    app.listen(port, () => {
        console.log(` Server is running on http://localhost:${port}`);
    });
}

export default app;