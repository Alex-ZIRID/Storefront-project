Storefront Backend API

---

This project is an API built to support an online storefront where users can browse products, view product details, add products to an order, and manage their orders. The API supports secure authentication, role-based access, and database interactions using PostgreSQL.

---

Table of Contents
• Features
• Setup Instructions
• Database Setup
• Environment Variables
• Installing Dependencies
• Running the Project
• API Endpoints
• Products
• Users
• Orders
• Testing
• Database Schema

---

Features
• Full CRUD operations for Users, Products, and Orders.
• JWT-based authentication for secure user management.
• API built with TypeScript and Express.
• Integration with PostgreSQL database.
• Database migrations managed using db-migrate.

---

Setup Instructions

A. Database Setup

1. Install PostgreSQL on your system if not already installed.
2. Create two databases:
   • Development Database: storefront_dev
   • Test Database: storefront_test
3. Create a PostgreSQL user:
   CREATE USER full_stack_user WITH PASSWORD 'new_abc123';
4. Grant privileges:
   GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO full_stack_user;
   GRANT ALL PRIVILEGES ON DATABASE storefront_test TO full_stack_user;

B.Environment Variables
Create a .env file in the project root and include the following variables:
PORT=3000
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront_dev
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=full_stack_user
POSTGRES_PASSWORD=new_abc123
JWT_SECRET=my_jwt_secret
BCRYPT_PEPPER=my_pepper
BCRYPT_SALT_ROUNDS=10

C. Installing Dependencies
Install all project dependencies: 'npm install'

D. Running the Project

1. Compile TypeScript files: 'npm run build'
2. Run database migrations: 'npm run migrate:reset && npm run migrate:up'
3. Start the development server: 'npm run dev'
4. Access the API at http://localhost:3000

---

API Endpoints

Products
• GET /products - List all products.
• GET /products/:id - View details of a single product.
• POST /products - Create a new product. (Requires token)

Users
• POST /users/register - Register a new user.
• POST /users/login - Authenticate and get a token.
• GET /users - List all users. (Requires token)
• GET /users/:id - View details of a single user. (Requires token)

Orders
• GET /orders/current/:user_id - View the current order for a user. (Requires token)
• POST /orders - Create a new order. (Requires token)
• POST /orders/:order_id/products - Add a product to an order. (Requires token)

---

Testing

1. Run database migrations for the test environment: 'npm run migrate:reset && npm run migration:up'
2. Run the tests: 'npm run test'

---

Database Schema

Users Table
+------------+-------------------+--------------------------+
| Column | Type | Constraints |
+------------+-------------------+--------------------------+
| id | SERIAL PRIMARY KEY| |
| firstname | VARCHAR(255) | NOT NULL |
| lastname | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
+------------+-------------------+--------------------------+

Products Table
+----------+-------------------+--------------------------+
| Column | Type | Constraints |
+----------+-------------------+--------------------------+
| id | SERIAL PRIMARY KEY| |
| name | VARCHAR(255) | NOT NULL |
| price | NUMERIC(10, 2) | NOT NULL |
| category | VARCHAR(255) | |
+----------+-------------------+--------------------------+

Orders Table
+----------+-------------------+-----------------------------------------------+
| Column | Type | Constraints |
+----------+-------------------+-----------------------------------------------+
| id | SERIAL PRIMARY KEY| |
| user_id | INTEGER | REFERENCES users(id) |
| status | VARCHAR(50) | CHECK (status IN ('active', 'completed')), |
| | | NOT NULL |
+----------+-------------------+-----------------------------------------------+

Order Products Table
+-------------+-------------------+--------------------------+
| Column | Type | Constraints |
+-------------+-------------------+--------------------------+
| id | SERIAL PRIMARY KEY| |
| order_id | INTEGER | REFERENCES orders(id) |
| product_id | INTEGER | REFERENCES products(id) |
| quantity | INTEGER | CHECK (quantity > 0), |
| | | NOT NULL |
+-------------+-------------------+--------------------------+
