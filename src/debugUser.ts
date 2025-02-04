import { UserModel } from "./models/user";

const userStore = new UserModel();

const testUser = {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "password123",
};

async function testCreateUser() {
    try {
        console.log("TESTING: UserModel.create()");

        // Confirm object keys before inserting
        console.log("Confirming user properties:", Object.keys(testUser));

        // Ensure TypeScript sees correct data types
        console.log("Debugging - User input BEFORE INSERT:", JSON.stringify(testUser, null, 2));

        // Attempt to create the user
        const createdUser = await userStore.create(testUser);

        console.log("User created successfully:", createdUser);
    } catch (error) {
        console.error("Error creating user:", error);
    }
}

testCreateUser();