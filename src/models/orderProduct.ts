import client from "../database";

export type OrderProduct = {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
};

export class OrderProductModel {
    async addProductToOrder(orderProduct: OrderProduct): Promise<OrderProduct> {
        try {
            const conn = await client.connect();
            const sql = "INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *";
            const result = await conn.query(sql, [orderProduct.order_id, orderProduct.product_id, orderProduct.quantity]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add product to order. Error: ${(err as Error).message}`);
        }
    }

    async getProductsByOrder(order_id: number): Promise<OrderProduct[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM order_products WHERE order_id = $1";
            const result = await conn.query(sql, [order_id]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products for order ${order_id}. Error: ${(err as Error).message}`);
        }
    }
}