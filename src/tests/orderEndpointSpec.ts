import supertest from "supertest";
import app from "../server";
import { UserModel } from "../models/user";
import { ProductModel } from "../models/product";
import { OrderModel } from "../models/order";

const request = supertest(app);
const userStore = new UserModel();
const productStore = new ProductModel();
const orderStore = new OrderModel();

let token: string;
let testUserId: number;
let testOrderId: number;
let testProductId: number;

describe("Order Endpoints", () => {
    beforeAll(async () => {
        // Create a test user
        const testUser = await userStore.create({
            firstname: "Alice",
            lastname: "Johnson",
            email: "alice@example.com",
            password: "securepassword",
        });
        testUserId = testUser.id as number;

        // Authenticate and get token
        const response = await request.post("/users/login").send({
            email: testUser.email,
            password: "securepassword",
        });
        token = response.body.token;

        // Create a test product
        const testProduct = await productStore.create({
            name: "Test Product",
            price: 49.99,
            category: "Test Category",
        });
        testProductId = testProduct.id as number;

        // Create a test order
        const testOrder = await orderStore.create({
            user_id: testUserId,
            status: "active",
        });
        testOrderId = testOrder.id as number;
    });

    it("should create a new order on POST /orders (protected)", async () => {
        const response = await request
            .post("/orders")
            .set("Authorization", `Bearer ${token}`)
            .send({
                user_id: testUserId,
                status: "active",
            });

        expect(response.status).toBe(201);
        expect(response.body.user_id).toBe(testUserId);
    });

    it("should fetch the current order for a user on GET /orders/current/:user_id (protected)", async () => {
        const response = await request
            .get(`/orders/current/${testUserId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should add a product to an order on POST /orders/:order_id/products (protected)", async () => {
        const response = await request
            .post(`/orders/${testOrderId}/products`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                product_id: testProductId,
                quantity: 2,
            });
        
            expect(response.status).toBe(201);
            expect(response.body.addedProduct.order_id).toBe(testOrderId);
            expect(response.body.addedProduct.product_id).toBe(testProductId);
            expect(response.body.addedProduct.quantity).toBe(2);
    });
});