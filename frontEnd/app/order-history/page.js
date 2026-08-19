"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./page.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getMyOrders, getOrderById } from "@/services/orderService";

function OrderHistoryContent() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function loadOrders() {

            try {

                setLoading(true);
                setError("");

                const summaries = await getMyOrders();

                // The list endpoint doesn't include line items, so fetch each
                // order's detail (owner-only, enforced by the backend) in parallel.
                const withItems = await Promise.all(
                    summaries.map(async (order) => {
                        const detail = await getOrderById(order.id);
                        return { ...detail.order, items: detail.items };
                    })
                );

                setOrders(withItems);

            } catch (error) {

                console.error(
                    "Order history error:",
                    error
                );

                setError(
                    "Unable to load your order history. Please try again."
                );

            } finally {

                setLoading(false);

            }
        }


        loadOrders();

    }, []);


    // ==============================
    // LOADING STATE
    // ==============================

    if (loading) {

        return (
            <main className={styles.page}>

                <div className={styles.container}>

                    <p className={styles.eyebrow}>
                        ACCOUNT
                    </p>

                    <h1>Order History</h1>

                    <p className={styles.message}>
                        Loading your orders...
                    </p>

                </div>

            </main>
        );
    }


    // ==============================
    // ERROR STATE
    // ==============================

    if (error) {

        return (
            <main className={styles.page}>

                <div className={styles.container}>

                    <p className={styles.eyebrow}>
                        ACCOUNT
                    </p>

                    <h1>Order History</h1>

                    <div className={styles.error}>
                        {error}
                    </div>

                </div>

            </main>
        );
    }


    // ==============================
    // MAIN PAGE
    // ==============================

    return (
        <main className={styles.page}>

            <div className={styles.container}>

                <div className={styles.header}>

                    <div>

                        <p className={styles.eyebrow}>
                            ACCOUNT
                        </p>

                        <h1>Order History</h1>

                        <p className={styles.subtitle}>
                            View your previous orders and purchase details.
                        </p>

                    </div>


                    <Link
                        href="/products"
                        className={styles.shopButton}
                    >
                        Continue Shopping
                    </Link>

                </div>


                {orders.length === 0 ? (

                    <div className={styles.emptyState}>

                        <h2>No orders yet</h2>

                        <p>
                            You have not placed any orders yet.
                        </p>

                        <Link
                            href="/products"
                            className={styles.shopButton}
                        >
                            Start Shopping
                        </Link>

                    </div>

                ) : (

                    <div className={styles.orders}>

                        {orders.map((order) => (

                            <div
                                className={styles.orderCard}
                                key={order.id}
                            >

                                {/* ORDER HEADER */}

                                <div className={styles.orderHeader}>

                                    <div>

                                        <p className={styles.orderLabel}>
                                            ORDER
                                        </p>

                                        <h2>
                                            #{order.id}
                                        </h2>

                                    </div>


                                    <div className={styles.orderMeta}>

                                        <span className={
                                            styles.orderDate
                                        }>
                                            {formatDate(
                                                order.created_at
                                            )}
                                        </span>

                                        <span
                                            className={`${styles.status} ${
                                                getStatusClass(
                                                    order.status
                                                )
                                            }`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                </div>


                                <div className={styles.divider} />


                                {/* ORDER ITEMS */}

                                <div className={styles.items}>

                                    <h3>Items</h3>


                                    {order.items.map((item, index) => (

                                        <div
                                            className={styles.item}
                                            key={`${item.name}-${index}`}
                                        >

                                            <div className={styles.itemInfo}>

                                                <span className={
                                                    styles.productName
                                                }>
                                                    {item.name}
                                                </span>

                                                <span className={
                                                    styles.quantity
                                                }>
                                                    Quantity: {item.quantity}
                                                </span>

                                            </div>


                                            <span className={
                                                styles.itemPrice
                                            }>
                                                ${formatPrice(
                                                    item.price_at_purchase
                                                )}
                                            </span>

                                        </div>

                                    ))}

                                </div>


                                <div className={styles.divider} />


                                {/* ORDER TOTAL */}

                                <div className={styles.orderTotal}>

                                    <span>
                                        Order Total
                                    </span>

                                    <strong>
                                        ${formatPrice(
                                            order.total_price
                                        )}
                                    </strong>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}


export default function OrderHistoryPage() {
    return (
        <ProtectedRoute>
            <OrderHistoryContent />
        </ProtectedRoute>
    );
}


/*
 * Format database date for display.
 */
function formatDate(date) {

    if (!date) {
        return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


/*
 * Format prices as currency.
 */
function formatPrice(price) {

    const number = Number(price);

    if (Number.isNaN(number)) {
        return "0.00";
    }

    return number.toFixed(2);
}


/*
 * Give each order status its own CSS class.
 */
function getStatusClass(status) {

    switch (status) {

        case "shipped":
            return styles.shipped;

        case "delivered":
            return styles.shipped;

        case "pending":
            return styles.pending;

        case "confirmed":
            return styles.processing;

        default:
            return styles.defaultStatus;
    }
}