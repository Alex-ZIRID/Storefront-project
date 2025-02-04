import dotenv from "dotenv";
import bcrypt from "bcrypt";
import client from "../database";

dotenv.config();

const BCRYPT_PEPPER = process.env.BCRYPT_PEPPER as string;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS as string, 10);

export type User = {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
};

export class UserModel {
    async create(user: User): Promise<User> {
        try {
            
            if (!user.firstname || !user.lastname || !user.email || !user.password) {
                throw new Error(`ERROR: Missing required user fields! Received: ${JSON.stringify(user, null, 2)}`);
            }
    
            const conn = await client.connect();
            const sql = `INSERT INTO users (firstname, lastname, email, password) 
                         VALUES ($1, $2, $3, $4) RETURNING id, firstname, lastname, email`;
    
            const hash = bcrypt.hashSync(user.password + BCRYPT_PEPPER, BCRYPT_SALT_ROUNDS);
            const result = await conn.query(sql, [user.firstname, user.lastname, user.email, hash]);
    
    
            conn.release();
            return result.rows[0];
        } catch (err) {
            console.error(" Error creating user:", err);
            throw new Error(`Could not create user. Error: ${(err as Error).message}`);
        }
    }

    async authenticate(email: string, password: string): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql = `SELECT id, firstname, lastname, email, password FROM users WHERE email = $1`;
            const result = await conn.query(sql, [email]);

            if (result.rows.length) {
                const user = result.rows[0];

                if (bcrypt.compareSync(password + BCRYPT_PEPPER, user.password)) {
                    conn.release();
                    return {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                    };
                }
            }

            conn.release();
            return null;
        } catch (err) {
            throw new Error(`Could not authenticate user. Error: ${(err as Error).message}`);
        }
    }

    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = `SELECT id, firstname, lastname, email FROM users`;
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not fetch users. Error: ${(err as Error).message}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await client.connect();
            const sql = `SELECT id, firstname, lastname, email FROM users WHERE id = $1`;
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not fetch user ${id}. Error: ${(err as Error).message}`);
        }
    }

    async delete(id: number): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql = `DELETE FROM users WHERE id = $1 RETURNING id, firstname, lastname, email`;
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows.length ? result.rows[0] : null;
        } catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${(err as Error).message}`);
        }
    }
}