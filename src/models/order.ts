import client from "../database";

export type Order = {
    id?: number;
    user_id: number;
    status: string;
};

export type OrderProduct = {
    order_id: number;
    product_id: number;
    quantity: number;
};

export class OrderModel {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE id = $1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${(err as Error).message}`);
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'INSERT INTO orders ("user_id", "status") VALUES ($1, $2) RETURNING *';
            const result = await conn.query(sql, [order.user_id, order.status]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not create order. Error: ${(err as Error).message}`);
        }
    }

    async getActiveOrdersByUser(user_id: number): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE "user_id" = $1 AND "status" = $2';
            const result = await conn.query(sql, [user_id, 'active']);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get active orders for user ${user_id}. Error: ${(err as Error).message}`);
        }
    }

    async addProductToOrder(order_id: number, product_id: number, quantity: number): Promise<OrderProduct> {
        try {
            const conn = await client.connect();
            const sql = `INSERT INTO order_products ("order_id", "product_id", "quantity") 
                         VALUES ($1, $2, $3) RETURNING *`;
            const result = await conn.query(sql, [order_id, product_id, quantity]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Could not add product ${product_id} to order ${order_id}. Error: ${(err as Error).message}`
            );
        }
    }
}