import supertest from "supertest";
import app from "../server";
import { UserModel } from "../models/user";
import { ProductModel } from "../models/product";

const request = supertest(app);
const userStore = new UserModel();
const productStore = new ProductModel();

let token: string;
let testProductId: number;

describe("Product Endpoints", () => {
    beforeAll(async () => {
        // Create a test user and authenticate to get a token
        const testUser = await userStore.create({
            firstname: "Admin",
            lastname: "User",
            email: "admin@example.com",
            password: "adminpass",
        });

        const response = await request.post("/users/login").send({
            email: testUser.email,
            password: "adminpass",
        });
        token = response.body.token;

        // Create a test product
        const testProduct = await productStore.create({
            name: "Sample Product",
            price: 99.99,
            category: "Test Category",
        });
        testProductId = testProduct.id as number;
    });

    it("should fetch all products on GET /products", async () => {
        const response = await request.get("/products");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTrue();
    });

    it("should fetch a single product on GET /products/:id", async () => {
        const response = await request.get(`/products/${testProductId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testProductId);
    });

    it("should create a new product on POST /products (protected)", async () => {
        const response = await request
            .post("/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "New Product",
                price: 49.99,
                category: "New Category",
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("New Product");
        expect(parseFloat(response.body.price)).toBe(49.99);
        expect(response.body.category).toBe("New Category");
    });
});