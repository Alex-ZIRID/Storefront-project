import { Order, OrderModel } from "../models/order";
import { Product, ProductModel } from "../models/product";
import { User, UserModel } from "../models/user";
import { resetTestDB } from "./helpers/resetTestDB";

const orderModel = new OrderModel();
const productModel = new ProductModel();
const userModel = new UserModel();

let testUserId: number;
let testOrderId: number;

describe("OrderModel", () => {
    beforeAll(async () => {
        try {
            await resetTestDB();
            const user = await userModel.create({
                firstname: "Alice",
                lastname: "Johnson",
                email: "alice@example.com",
                password: "securepassword",
            });
            testUserId = user.id as number;
            const product = await productModel.create({
                name: "Test Product",
                price: 49.99,
                category: "Test Category",
            });
            const order = await orderModel.create({
                user_id: testUserId,
                status: "active",
            });
            testOrderId = order.id as number;
        } catch (error) {
        }
    });

    afterAll(async () => {
        await resetTestDB();
    });

    it("should have an index method", () => {
        expect(orderModel.index).toBeDefined();
    });

    it("should have a show method", () => {
        expect(orderModel.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(orderModel.create).toBeDefined();
    });

    it("create method should add an order", async () => {
        const newOrder = await orderModel.create({
            user_id: testUserId,
            status: "active",
        });

        expect(newOrder).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            user_id: testUserId,
            status: "active",
        }));
    });

    it("index method should return a list of orders", async () => {
        const orders = await orderModel.index();
        expect(orders.length).toBeGreaterThan(0);
    });

    it("show method should return the correct order", async () => {
        const order = await orderModel.show(testOrderId);
        expect(order).toEqual({
            id: testOrderId,
            user_id: testUserId,
            status: "active",
        });
    });
});