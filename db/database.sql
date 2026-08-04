CREATE DATABASE insert_name;

--Here we'll put how we decide to connect it to everything else i.e. the backend person's job
--In psql: \c insert_name
CREATE TABLE users (
    userID TEXT PRIMARY KEY, 
    username TEXT,
    user_email TEXT,
    --etc.
)
CREATE TABLE customers (
    customerID TEXT PRIMARY KEY, 
    customer_name TEXT, 
    customer_email TEXT,
    customer_phone TEXT,
    customer_streetaddress TEXT,
    customer_state TEXT, 
    customer_zip TEXT
);
CREATE TABLE categories (
--maybe a numeric system linking a number to a category or I can write it as a TEXT CHECK instead??
);

CREATE TABLE products (
    productID TEXT PRIMARY KEY, 
    product_name TEXT, 
    category TEXT
    --etc.
);

CREATE TABLE inventory (
    productID TEXT PRIMARY KEY REFERENCES products(productID),
    quantity_on_hand INT, 
    order_quantity INT
    --etc.
);

CREATE TABLE orders (
    orderID TEXT PRIMARY KEY,
    customerID TEXT REFERENCES customers(customerID),
    order_date DATE, 
    --etc.
    --status TEXT REFERENCES payments (payments)
);

--this table should represent one item in an order 
CREATE TABLE order_items (
    orderID TEXT PRIMARY KEY REFERENCES orders(orderID),
    productID TEXT REFERENCES inventory(productID),
    quantity INT,
    quantity_on_hand TEXT REFERENCES inventory(quantity_on_hand),
    order_date TEXT REFERENCES orders(order_date)
);

CREATE TABLE payments (
    paymentID TEXT PRIMARY KEY, 
    orderID TEXT REFERENCES orders(orderID),
    amount REAL, 
    status TEXT CHECK (status IN (
        'Paid',
        'Unpaid',
        'Payment Pending',
        'Canceled',
        'Refunded'
    ))

)

