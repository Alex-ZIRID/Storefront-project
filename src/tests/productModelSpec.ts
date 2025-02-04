import { Product, ProductModel } from "../models/product";
import { resetTestDB } from "./helpers/resetTestDB"; 

const productStore = new ProductModel();

describe("ProductModel", () => {
    let createdProduct: Product;

    beforeAll(async () => {
        await resetTestDB(); 

        createdProduct = await productStore.create({
            name: "Laptop",
            price: 999.99,
            category: "Electronics",
        });
    });

    it("should have an index method", () => {
        expect(productStore.index).toBeDefined();
    });

    it("should have a show method", () => {
        expect(productStore.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(productStore.create).toBeDefined();
    });

    it("create method should add a product", async () => {
        expect({
            ...createdProduct,
            price: parseFloat(createdProduct.price as unknown as string), 
        }).toEqual({
            id: createdProduct.id,
            name: "Laptop",
            price: 999.99,
            category: "Electronics",
        });
    });

    it("index method should return a list of products", async () => {
        const products = await productStore.index();
        expect(products.length).toBeGreaterThan(0);
    });

    it("show method should return the correct product", async () => {
        const product = await productStore.show(createdProduct.id as number);
        expect(product).toEqual(createdProduct);
    });
});