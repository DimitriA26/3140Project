# Vertical Slice Breakdown for 5 Developers
Parallel execution: I set this up for Tier 2. 
Please test. 
Use separate commit branches (as I have put below per person's task) will help us fix one bug at a time.
We will all peer review before we push any branches to MAIN. 
Tasks are guidelines/suggestions so you can tweak to your liking as long as we fulfill the necessary requirements. 
Please check off completed tasks as they are completed, we need some kind of global project management. 
*I recommend reading the whole thing to get the full picture I really broke it down into layman's terms. We can do this, guys!!!*
# Phase 0: Foundation (Schema) - Ashley
## Task 1: PostgreSQL Schema & Seed Data 
### Subtasks:
- [x] Create database and connection module
- [ ] backend/config/database.js with connection pool
- [ ] environment variables
- [ ] Foreign keys, indexes, constraints 
- [ ] Create seed script 
- [ ] 8+ products with realistic data
- [ ] 2-3 test users (customer & admin) 
- [ ] write schema migration file 

#### Tables: 
- [ ] **Users** (id, email, password_hash, name, role)
- [ ] **Products** (id, name, description, price, category, image_url, inventory) 
- [ ] **Categories** (id, name) 
- [ ] **Carts** (id, user_id, created_at)
- [ ] **CartItems** (id, cart_id, product_id, quantity)
- [ ] **Orders** (id, user_id, total_price, status, created_at) 
- [ ] **OrderItems** (id, order_id, product_id, quantity, price_at_purchase)

## Test for Completion
- [ ] Seed script runs without errors
- [ ] All team members can clone and initialize database locally

# 5 Core Vertical Slices (this ensures that we have some semblance of an app even if someone doesn't complete/do their slice
Features will be linked to you to ensure fair grading. 
**Please insert your name here to absorb the responsibilities of a slice**
**Please utilize the recommended branch name**
## Role: Authentication & User Management
**Branch: authentication**

### Backend Tasks
- [ ] Create user controller 
- [ ] Hash passwords
- [ ] Register endpoint (for a new account)
- [ ] Login endpoint (for returning user) returns JSON WEB TOKEN
- [ ] Validate email and password requirements 
- [ ] Create authentication middleware
- [ ] Verify JSON WEB TOKEN
- [ ] Check role: user? admin? 
- [ ] Create user routes
- [ ] Three main functions: 
    -> Create user, hash password
    -> Validate, return token
    -> Return current user 

### Frontend Tasks
- [ ] Create authentication service 
- [ ] Register function (POST to backend)
- [ ] Login function (POST to backend, store token in localStorage) 
- [ ] Get current user function
- [ ] Logout function
- [ ] Create authentication pages
- [ ] /auth/register UI (form(input), validation, error states)
- [ ] /auth/login UI (form(input), validation, error states) 
- [ ] Create authentication context/state management -> who is currentUser? globally (we should be able to see this on all pages)
- [ ] Create protected route wrapper 
- [ ] Redirect unauthenticated users to login (unregistered email on the login page should redirect to create/register account) 

### Important Test Cases 
- [ ] Test register with valid/invalid data
- [ ] Test login with correct/incorrect credentials
- [ ] Test protected routes without token 
- [ ] Test token persistence 

**Please insert your name here to absorb the responsibilities of a slice**
**Please utilize the recommended branch name**
## Role: Customer Order History & Order Details
**Branch: order-history**

### Backend Tasks
- [ ] Create order controller
- [ ] Get all orders for current user
- [ ] Get single order by ID (with order items) 
- [ ] List order items for an order
- [ ] Create order routes
- [ ] Include product details in response (name, price, image)
- [ ] Add order status tracking
- [ ] status field: pending, confirmed, shipped, delivered

### Frontend Tasks
- [ ] Create orderService.js
- [ ] Fetch user's orders
- [ ] Fetch single order by ID
- [ ] Create order history page
- [ ] /orders -> should list all user orders
- [ ] Display order ID, date, total, status
- [ ] Link to order detail page
- [ ] Create order detail page
      - List order items (product name, quantity, price)
- [ ] Show order status
- [ ] Empty state if no orders

### Testing
- [ ] fetchOrders will return only the current user's orders
- [ ] order detail includes correct items
- [ ] invalid order ID return 404
- [ ] empty state displays when no orders exist
- [ ] only authenticated users can view their own orders -> *please sign in to view order/order history*

**Please insert your name here to absorb the responsibilities of a slice**
**Please utilize the recommended branch name**
## Role: Product Search, Filter & Sort
**Branch: product-discovery**

### Backend Tasks 
- [ ] enhance product routes
- [ ] support filtering by category
- [ ] support sorting (price, name, newest, on sale, in stock)
- [ ] support pagination (limit, offset or page)
- [ ] create search logic
- [ ] query products by name or description (ILIKE in PostgreSQL)
- [ ] Return match count and results
- [ ] Create filter logic
- [ ] Filter by category using JOIN
- [ ] Filter by price range (min/max)
- [ ] filter by availability (in stock only)

### Frontend Tasks 
- [ ] Create productService.js
- [ ] fetch products with query param
- [ ] create or enhance products page
- [ ] /products -> product listing with filters and search
- [ ] add search input (debounced API calls)
- [ ] add filter sidebar (category, price range, in-stock checkbox)
- [ ] Display results/Product Grid (how many products would you like to see per page, how would you like to see them)
- [ ] Add loading & error states
- [ ] show spinner while fetching
- [ ] show error message if request fails
- [ ] show empty state if no results

### Testing
- [ ] Search returns products matching name/description
- [ ] filter by category works
- [ ] sort by price ascending/descending
- [ ] display results works 
- [ ] query params persist in URL (products?category=X&sort=price&order=asc&search=term)
- [ ] results update without page reload 

**Please insert your name here to absorb the responsibilities of a slice**
**Please utilize the recommended branch name**
## Role: Admin Product Management
**Branch: admin-products**

### Backend Tasks 
- [ ] create adminProductController.js
- [ ] List all products (admin view with edit/delete options) GET
- [ ] Create product POST
- [ ] Update product PUT
- [ ] Delete Product DELETE
- [ ] Update Inventory PATCH
- [ ] add role-based authorization middleware
- [ ] only admin role can access these routes ^^

### Frontend Tasks
- [ ] create adminService.js
- [ ] **C**reate**R**ead**U**pdate**D**elete functions for products
- [ ] Create admin layout/navigation
- [ ] /admin - admin dashboard (protected)
- [ ] Link to product management page
- [ ] Create product management page
- [ ] /admin/products - list all products with edit/delete buttons
- [ ] table or grid view (toggleable)
- [ ] Create product form
      /admin/products/new - create new product
      /admin/products/[id]/edit - edit existing product
- [ ] Form fields: name, desc, price, category, image_url, inventory
- [ ] validation & error messages
- [ ] success/failure notifications
- [ ] add delete confirmation modal - *are you sure you want to delete this item?*

### Testing 
- [ ] Admin can create product
- [ ] Admin can edit product details
- [ ] Admin can delete product
- [ ] Admin can update inventory
- [ ] Non-admins cannot access admin routes
- [ ] form validation prevents invalid/incomplete data

**Please insert your name here to absorb the responsibilities of a slice**
**Please utilize the recommended branch name**
## Role: Admin Order Management
**Branch: admin-orders**

### Backend Tasks
- [ ] Create adminOrderController.js
- [ ] List all orders (admin view) Global
- [ ] Get order details
- [ ] Update order status **see Customer Order History & Order Details**
- [ ] Create admin order routes
      GET /api/admin/orders -> all orders, sorted by date *admin only!*
      GET /api/admin/orders/:id -> order detail with items and customer info *admin only!*
      PATCH /api/admin/orders/:id/status -> update status *admin only!*
- [ ] Include customer name and email in response (when updating status)
- [ ] Add filtering, sorting
- [ ] Filter by status
- [ ] Sort by date, customer, total

### Frontend Tasks
- [ ] Create adminService.js
- [ ] /admin/orders -> Fetch all orders
- [ ] Fetch order by ID
- [ ] update order status *maybe we can make this color coded?*
- [ ] Create order management page
      table view: order ID, customer, date, total, status, actions
- [ ] filter by status dropdown
- [ ] click row to view details
- [ ] create order detail page
- [ ] /admin/orders/[id] -> full order info with customer name, email and address
      list order items
      status dropdown to update
      timestamp when status last changed 

### Testing 
- [ ] admin can see all orders
- [ ] admin can update order status
- [ ] customer email/name displaying correctly *use database to confirm*
- [ ] status updates are reflected in customer view
      *seems like testing will be a lot of making a change as an admin user and then signing into the customer's account to make sure they can see it too*
- [ ] non-admins CANNOT access admin routes
- [ ] order totals are calculated correctly




