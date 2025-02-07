import { User, UserModel } from "../models/user";
import { resetTestDB } from "./helpers/resetTestDB";

const userStore = new UserModel();
let createdUser: User;

describe("UserModel", () => {
    beforeAll(async () => {
        try {
            await resetTestDB();
            createdUser = await userStore.create({
                firstname: "John",
                lastname: "Doe",
                email: "john.doe@example.com",
                password: "password123",
            });
        } catch (error) {
            console.error("Error in beforeAll setup:", error);
        }
    });

    it("create method should add a user", async () => {
        const expectedUser = {
            id: createdUser.id,
            firstname: "John",  
            lastname: "Doe",    
            email: "john.doe@example.com",
        };

        expect(createdUser).toEqual(jasmine.objectContaining(expectedUser));
    });

    it("authenticate method should return the user if credentials are correct", async () => {
        const authenticatedUser = await userStore.authenticate("john.doe@example.com", "password123");

        const expectedUser = {
            id: createdUser.id,
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
        };

        expect(authenticatedUser).toEqual(jasmine.objectContaining(expectedUser));
    });

    it("index method should return a list of users", async () => {
        const users = await userStore.index();
        expect(users.length).toBeGreaterThan(0);
    });

    it("show method should return the correct user", async () => {
        const user = await userStore.show(createdUser.id as number);

        const expectedUser = {
            id: createdUser.id,
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
        };

        expect(user).toEqual(jasmine.objectContaining(expectedUser));
    });
});