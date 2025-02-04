import { OrderProductModel } from "../models/orderProduct";
import { Product, ProductModel } from "../models/product";
import { Order, OrderModel } from "../models/order";
import { User, UserModel } from "../models/user";
import { resetTestDB } from "./helpers/resetTestDB";

const orderProductModel = new OrderProductModel();
const productModel = new ProductModel();
const orderModel = new OrderModel();
const userModel = new UserModel();

let testUserId: number;
let testProductId: number;
let testOrderId: number;

describe("OrderProductModel", () => {
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
            testProductId = product.id as number;
            const order = await orderModel.create({
                user_id: testUserId,
                status: "active",
            });
            testOrderId = order.id as number;
            await orderProductModel.addProductToOrder({
                order_id: testOrderId,
                product_id: testProductId,
                quantity: 3,
            });
        } catch (error) {
            console.error("Error in beforeAll setup:", error);
        }
    });
    
    afterAll(async () => {
        await resetTestDB();
    });

    it("should have an addProductToOrder method", () => {
        expect(orderProductModel.addProductToOrder).toBeDefined();
    });

    it("should have a getProductsByOrder method", () => {
        expect(orderProductModel.getProductsByOrder).toBeDefined();
    });

    it("addProductToOrder method should add a product to an order", async () => {
        const addedProduct = await orderProductModel.addProductToOrder({
            order_id: testOrderId,
            product_id: testProductId,
            quantity: 3,
        });

        expect(addedProduct).toEqual(jasmine.objectContaining({
            id: jasmine.any(Number),
            order_id: testOrderId,
            product_id: testProductId,
            quantity: 3,
        }));
    });

    it("getProductsByOrder method should return products in an order", async () => {
        const orderProducts = await orderProductModel.getProductsByOrder(testOrderId);

        expect(orderProducts.length).toBeGreaterThan(0);
        expect(orderProducts).toContain(jasmine.objectContaining({
            order_id: testOrderId,
            product_id: testProductId,
            quantity: 3,
        }));
    });
});