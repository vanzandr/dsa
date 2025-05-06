"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the notification context
const NotificationContext = createContext(null)

// Demo notifications
const initialNotifications = [
    {
        id: "n1",
        type: "reservation",
        title: "New Reservation",
        message: "Diwata Pares reserved a 2016 Toyota Camry",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
        data: {
            reservationId: "R001",
            carId: "1",
            customerName: "Diwata Pares",
        },
    },
    {
        id: "n2",
        type: "return",
        title: "Car Return Request",
        message: "Diwata Pares requested to return a 2018 Honda Civic",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
        data: {
            reservationId: "R002",
            carId: "2",
            customerName: "Diwata Pares",
        },
    },
]

export const NotificationProvider = ({ children }) => {
    // Check if notifications exist in localStorage
    const storedNotifications = localStorage.getItem("pahiramcar_notifications")
    const [notifications, setNotifications] = useState(
        storedNotifications ? JSON.parse(storedNotifications) : initialNotifications,
    )

    // Update localStorage when notifications change
    useEffect(() => {
        localStorage.setItem("pahiramcar_notifications", JSON.stringify(notifications))
    }, [notifications])

    // Add a new notification
    const addNotification = (notification) => {
        const newNotification = {
            id: `n${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
            ...notification,
        }

        setNotifications((prev) => [newNotification, ...prev])
        return newNotification
    }

    // Mark a notification as read
    const markAsRead = (notificationId) => {
        setNotifications((prev) =>
            prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
        )
    }

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    }

    // Delete a notification
    const deleteNotification = (notificationId) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
    }

    // Get unread notifications count
    const unreadCount = notifications.filter((notification) => !notification.read).length

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                markAsRead,
                markAllAsRead,
                deleteNotification,
                unreadCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

// Custom hook to use the notification context
export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}

