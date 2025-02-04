import client from "../../database";

export const resetTestDB = async () => {
    try {
        const conn = await client.connect();
        await conn.query(`TRUNCATE order_products, orders, users RESTART IDENTITY CASCADE;`);
        conn.release();
    } catch (err) {
        throw new Error(`Could not reset test database. Error: ${(err as Error).message}`);
    }
};