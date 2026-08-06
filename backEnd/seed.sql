-- Categories
INSERT INTO categories (category) VALUES
('Electronics'),
('Books'),
('Clothing'),
('Home'),
('Sports');

-- Customers
INSERT INTO customers (
    customerID,
    customer_name,
    customer_email,
    customer_phone,
    customer_streetaddress,
    customer_state,
    customer_zip
) VALUES
('C001','John Smith','john@example.com','555-1111','123 Main St','NY','11209'),
('C002','Jane Doe','jane@example.com','555-2222','456 Oak Ave','NJ','07030');

-- Users
INSERT INTO users (
    userID,
    username,
    user_email
) VALUES
('U001','johnsmith','john@example.com'),
('U002','janedoe','jane@example.com');

-- Products
INSERT INTO products (
    productID,
    product_name,
    category
) VALUES
('P001','Gaming Mouse','Electronics'),
('P002','Mechanical Keyboard','Electronics'),
('P003','Java Programming Book','Books'),
('P004','Wireless Headphones','Electronics'),
('P005','Running Shoes','Sports'),
('P006','Desk Lamp','Home');

-- Inventory
INSERT INTO inventory (
    productID,
    quantity_on_hand,
    order_quantity
) VALUES
('P001',25,0),
('P002',12,0),
('P003',50,0),
('P004',8,0),
('P005',30,0),
('P006',14,0);

-- Orders
INSERT INTO orders (
    orderID,
    customerID,
    order_date
) VALUES
('O001','C001','2026-08-06'),
('O002','C002','2026-08-06');

-- Order Items
INSERT INTO order_items (
    orderID,
    productID,
    quantity,
    quantity_on_hand,
    order_date
) VALUES
('O001','P001',1,'25','2026-08-06'),
('O001','P003',2,'50','2026-08-06'),
('O002','P004',1,'8','2026-08-06');

-- Payments
INSERT INTO payments (
    paymentID,
    orderID,
    amount,
    status
) VALUES
('PAY001','O001',89.97,'Paid'),
('PAY002','O002',129.99,'Payment Pending');