PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    userID TEXT PRIMARY KEY,
    username TEXT,
    user_email TEXT
);

CREATE TABLE IF NOT EXISTS customers (
    customerID TEXT PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    customer_streetaddress TEXT,
    customer_state TEXT,
    customer_zip TEXT
);

-- The original draft did not define any category columns.
-- A single category field is included so the table can exist and products can reference it.
CREATE TABLE IF NOT EXISTS categories (
    category TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS products (
    productID TEXT PRIMARY KEY,
    product_name TEXT,
    category TEXT,
    FOREIGN KEY (category) REFERENCES categories(category)
);

CREATE TABLE IF NOT EXISTS inventory (
    productID TEXT PRIMARY KEY,
    quantity_on_hand INTEGER,
    order_quantity INTEGER,
    FOREIGN KEY (productID) REFERENCES products(productID)
);

CREATE TABLE IF NOT EXISTS orders (
    orderID TEXT PRIMARY KEY,
    customerID TEXT,
    order_date DATE,
    FOREIGN KEY (customerID) REFERENCES customers(customerID)
);

CREATE TABLE IF NOT EXISTS order_items (
    orderID TEXT,
    productID TEXT,
    quantity INTEGER,
    quantity_on_hand TEXT,
    order_date TEXT,
    PRIMARY KEY (orderID, productID),
    FOREIGN KEY (orderID) REFERENCES orders(orderID),
    FOREIGN KEY (productID) REFERENCES inventory(productID)
);

CREATE TABLE IF NOT EXISTS payments (
    paymentID TEXT PRIMARY KEY,
    orderID TEXT,
    amount REAL,
    status TEXT CHECK (
        status IN (
            'Paid',
            'Unpaid',
            'Payment Pending',
            'Canceled',
            'Refunded'
        )
    ),
    FOREIGN KEY (orderID) REFERENCES orders(orderID)
);
