# 3140Project
# Order History Feature

## Overview

The Order History feature allows a customer to view their previous orders from
the website.

The feature connects the frontend to the backend and returns
order information from the database.
Customers can see:

- Previous order IDs
- Order dates
- Products purchased
- Quantity purchased
- Payment amount

## Goals / Outcomes

1. Retrieve a customer's orders from the database.
2. Provide an API endpoint that the frontend can use.
3. Display the returned orders in a dedicated Next.js page.
4. Provide a navigation link so customers can access their order history.

## Project Structure

Impacted files:

backEnd/
── db_functions/
   ── order.js
── server.js

frontEnd/
── app/
   ── order-history/
       ── page.js
       ── page.module.css
