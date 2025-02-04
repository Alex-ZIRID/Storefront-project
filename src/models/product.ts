import client from "../database";

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
};

export class ProductModel {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${(err as Error).message}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id = $1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${(err as Error).message}`);
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO products ("name", "price", "category") VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [
                product.name,
                product.price,
                product.category,
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Could not add new product ${product.name}. Error: ${(err as Error).message}`
            );
        }
    }
}