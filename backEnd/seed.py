from Faker import Faker
from datetime import datetime, timedelta
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os

fake = Faker()
Faker.seed(0)  

today = datetime.now()
yesterday = today - timedelta(days=1)
two_days_ago = today - timedelta(days=2)

"""
Test Credentials: 
- Admin: admin_pass_123, admin_pass_456
- Customer: customer_pass_123, customer_pass_456
"""
NODE_ENV = os.getenv('NODE_ENV', 'development')

if NODE_ENV == 'production':
    print("Error! Cannot seed production database!")
    exit(1)

load_dotenv()

DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')
DB_NAME = os.getenv('DB_NAME', 'ecommerce_db')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')

def seed():
    try:

        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME
        )
        cursor = conn.cursor()
        print ("Sucessfully connected to the database, starting to seed.")

        #Clear existing data in reverse -> this just makes sure the same data gets reseeded everytime on a fresh canvas. 
        cursor.execute("DELETE FROM order_items")
        cursor.execute("DELETE FROM orders")
        cursor.execute("DELETE FROM cart_items")
        cursor.execute("DELETE FROM carts")
        cursor.execute("DELETE FROM products")
        cursor.execute("DELETE FROM categories")
        cursor.execute("DELETE FROM users")
        conn.commit()

        #Seed users
        users = [
            ("CID001", fake.name(), fake.email(), 'customer_pass_123', 'Customer'),
            ("CID002", fake.name(), fake.email(), 'customer_pass_456', 'Customer'),
            ("AID001", fake.name(), fake.email(), 'admin_pass_123', 'Admin'),
            ("AID002", fake.name(), fake.email(), 'admin_pass_456', 'Admin')
        ]

        for user in users:
            cursor.execute(
                "INSERT INTO users (userID, user_name, user_email, password_hash, role) VALUES (%s, %s, %s, %s, %s)",
                user
            )
        conn.commit()

        #Seed categories
        categories = [
            ("CAT001", "Textbooks"),
            ("CAT002", "Office Supplies"),
            ("CAT003", "Electronics"),
            ("CAT004", "Backpacks"),
        ] 

        for category in categories:
            cursor.execute(
                "INSERT INTO categories (categoryID, category_name) VALUES (%s, %s)",
                category
            )
        conn.commit()

        #Seed products
        products = [
            ("PID001", "K & R Textbook", "A concise, practical introduction to C, covering syntax, control structures, functions, and UNIX system calls.", 75.00, 10, "CAT001"),
            ("PID002", "HitchHiker's Guide to the Galaxy", "A humorous look at the universe.", 100.00, 15, "CAT001"),
            ("PID003", "Notebook", "A standard notebook for taking notes.", 5.00, 50, "CAT002"),
            ("PID004", "Muji Pen Set", "A set of high-quality pens.", 15.00, 30, "CAT002"),
            ("PID005", "Graphing Calculator", "A powerful graphing calculator for advanced mathematics.", 150.00, 5, "CAT003"),
            ("PID006", "Jansport Backpack", "A durable backpack for carrying your items.", 50.00, 20, "CAT004"),
        ]

        for product in products:
            cursor.execute(
                "INSERT INTO products (productID, product_name, description, price, inventory_quantity, category) VALUES (%s, %s, %s, %s, %s, %s)",
                product
            )

        conn.commit()

        #Seed orders 
        orders = [
            ("ORD001", users[0][0], two_days_ago, 150.00, "Processing") # calculator and backpack
            ("ORD002", users[1][0], yesterday, 175.00, "Pending") # K&R and Hitchhiker's
            ("ORD003", users[0][0], today, 600.00, "Cancelled") # 4 calculators
        ]

        for order in orders:
            cursor.execute(
                "INSERT INTO orders (orderID, userID, created_at, total_price, order_status) VALUES (%s, %s, %s, %s, %s)",
                order
            )
        conn.commit()

        #seed order_items
        order_items = [
            (orders[0][0], products[4][0], 1, 150.00),
            (orders[0][0], products[5][0], 1, 50.00),
            (orders[1][0], products[0][0], 1, 75.00),
            (orders[1][0], products[1][0], 1, 100.00),
            (orders[2][0], products[4][0], 4, 150.00)
        ]

        for item in order_items:
            cursor.execute(
                "INSERT INTO order_items (orderID, productID, quantity, price_at_purchase) VALUES (%s, %s, %s, %s)",
                item
            )
        conn.commit()

        #seed carts 
        carts = [
            (users[0][0]),
            (users[1][0])
        ]

        for cart in carts:
            cursor.execute(
                "INSERT INTO carts (userID) VALUES (%s)",
                cart
            )
        cart_id = cursor.fetchone()[0] 
        conn.commit()

        #seed cart_items
        cart_items = [
            (1, products[2][0], 3), # 3 notebooks in user 1's cart
            (1, products[3][0], 2), # 2 pen sets in user 1's cart
            (2, products[5][0], 1)  # 1 backpack in user 2's cart
        ]
