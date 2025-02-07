import supertest from "supertest";
import app from "../server";
import { UserModel } from "../models/user";

const request = supertest(app);
const userStore = new UserModel();
let token: string;

describe("User Endpoints", () => {
    beforeAll(async () => {
        // Create a test user and authenticate to get a token
        const testUser = await userStore.create({
            firstname: "John",
            lastname: "Doe",
            email: "testuser@example.com",
            password: "password123",
        });

        const response = await request.post("/users/login").send({
            email: testUser.email,
            password: "password123",
        });
        token = response.body.token;
    });

    it("should register a new user on POST /users/register", async () => {
        const response = await request.post("/users/register").send({
            firstname: "Jane",
            lastname: "Doe",
            email: "janedoe@example.com",
            password: "password123",
        });

        expect(response.status).toBe(201);
        expect(response.body.user.email).toBe("janedoe@example.com");
    });

    it("should authenticate and return a token on POST /users/login", async () => {
        const response = await request.post("/users/login").send({
            email: "testuser@example.com",
            password: "password123",
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it("should return a list of users on GET /users (protected)", async () => {
        const response = await request
            .get("/users")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTrue();
    });

    it("should return a specific user on GET /users/:id (protected)", async () => {
        const response = await request
            .get("/users/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
    });
});