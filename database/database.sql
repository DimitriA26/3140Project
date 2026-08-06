DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
--Here we'll put how we decide to connect it to everything else i.e. the backend person's job
--In psql: \c insert_name
CREATE TABLE users (
    userID TEXT PRIMARY KEY, 
    user_name TEXT,
    user_email TEXT,
    password_hash TEXT,
    role TEXT CHECK (role IN (
        'Admin',
        'Customer'
    ))
);

CREATE TABLE categories (
--maybe a numeric system linking a number to a category or I can write it as a TEXT CHECK instead??
    categoryID TEXT PRIMARY KEY,
    category_name TEXT
);

CREATE TABLE products (
    productID TEXT PRIMARY KEY, 
    product_name TEXT, 
    description TEXT,
    price REAL,
    category TEXT REFERENCES categories(categoryID),
    image_url TEXT,
    inventory_quantity INT
);


CREATE TABLE orders (
    orderID TEXT PRIMARY KEY,
    userID TEXT REFERENCES users(userID),
    created_at TIMESTAMP,
    total_price REAL,
    order_status TEXT CHECK (order_status IN (
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
    ))
);

--this table should represent one item in an order 
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    orderID TEXT NOT NULL REFERENCES orders(orderID),
    productID TEXT NOT NULL REFERENCES products(productID),
    quantity INT NOT NULL,
    price_at_purchase REAL
);


CREATE TABLE carts (
    cartID SERIAL PRIMARY KEY, 
    userID TEXT REFERENCES users(userID),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    cartID INTEGER REFERENCES carts(cartID),
    productID TEXT REFERENCES products(productID),
    quantity INT,
    PRIMARY KEY (cartID, productID)
);

