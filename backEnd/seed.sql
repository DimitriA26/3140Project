-- Run this once after schema.sql to add starter data.
-- Test login credentials:
--   customer@example.com / password123
--   admin@example.com    / admin123

INSERT INTO categories (name) VALUES
('Electronics'),
('Books'),
('Clothing'),
('Home'),
('Sports');

INSERT INTO products (name, description, price, category_id, image_url, inventory) VALUES
('Gaming Mouse', 'Ergonomic wired gaming mouse', 29.99, 1, 'https://placehold.co/400x400', 25),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 79.99, 1, 'https://placehold.co/400x400', 12),
('Java Programming Book', 'Beginner to advanced Java guide', 34.99, 2, 'https://placehold.co/400x400', 50),
('Wireless Headphones', 'Noise-cancelling over-ear headphones', 129.99, 1, 'https://placehold.co/400x400', 8),
('Running Shoes', 'Lightweight everyday running shoes', 64.99, 5, 'https://placehold.co/400x400', 30),
('Desk Lamp', 'Adjustable LED desk lamp', 19.99, 4, 'https://placehold.co/400x400', 14),
('Graphic T-Shirt', '100% cotton crew neck shirt', 15.99, 3, 'https://placehold.co/400x400', 40),
('Yoga Mat', 'Non-slip exercise mat', 22.99, 5, 'https://placehold.co/400x400', 20);

-- password123, hashed with bcrypt
INSERT INTO users (email, password_hash, name, role) VALUES
('customer@example.com', '$2b$10$tUd8llC/nFNG230Ri3LsBu1t8gmrzWI68mKJFj9P5Y7G59SjLkfR.', 'Test Customer', 'customer'),
-- admin123, hashed with bcrypt
('admin@example.com', '$2b$10$wPD3WpoEjxmqpO0KvXHPDOduaRUlxxZzhN9VJayxcyfo9nlIloX1K', 'Test Admin', 'admin');
