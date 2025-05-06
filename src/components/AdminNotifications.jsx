"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, X, Check, Calendar, Car, User, Clock } from "lucide-react"
import { useNotifications } from "../context/NotificationContext"

// Simple function to format time distance
const formatTimeDistance = (timestamp) => {
    try {
        const now = new Date()
        const date = new Date(timestamp)
        const seconds = Math.floor((now - date) / 1000)

        let interval = Math.floor(seconds / 31536000)
        if (interval >= 1) {
            return interval === 1 ? "1 year ago" : `${interval} years ago`
        }

        interval = Math.floor(seconds / 2592000)
        if (interval >= 1) {
            return interval === 1 ? "1 month ago" : `${interval} months ago`
        }

        interval = Math.floor(seconds / 86400)
        if (interval >= 1) {
            return interval === 1 ? "1 day ago" : `${interval} days ago`
        }

        interval = Math.floor(seconds / 3600)
        if (interval >= 1) {
            return interval === 1 ? "1 hour ago" : `${interval} hours ago`
        }

        interval = Math.floor(seconds / 60)
        if (interval >= 1) {
            return interval === 1 ? "1 minute ago" : `${interval} minutes ago`
        }

        return seconds < 10 ? "just now" : `${Math.floor(seconds)} seconds ago`
    } catch (error) {
        return "some time ago"
    }
}

export default function AdminNotifications() {
    const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications()
    const [isOpen, setIsOpen] = useState(false)
    const notificationRef = useRef(null)

    const toggleNotifications = () => {
        setIsOpen(!isOpen)
    }

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleMarkAsRead = (id) => {
        markAsRead(id)
    }

    const handleDelete = (id, e) => {
        e.stopPropagation()
        deleteNotification(id)
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case "reservation":
                return <Calendar className="h-5 w-5 text-blue-500" />
            case "return":
                return <Car className="h-5 w-5 text-green-500" />
            default:
                return <Bell className="h-5 w-5 text-gray-500" />
        }
    }

    const formatTime = (timestamp) => {
        try {
            return formatTimeDistance(timestamp)
        } catch (error) {
            return "some time ago"
        }
    }

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={toggleNotifications}
                className="relative p-2 text-gray-600 hover:text-black focus:outline-none"
                aria-label="Notifications"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-md shadow-lg overflow-hidden z-50">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        <div className="flex space-x-2">
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-sm text-gray-600 hover:text-black flex items-center">
                                    <Check className="h-4 w-4 mr-1" />
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No notifications</div>
                        ) : (
                            <div>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""
                                            }`}
                                    >
                                        <div className="flex">
                                            <div className="mr-3">{getNotificationIcon(notification.type)}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                                                    <button
                                                        onClick={(e) => handleDelete(notification.id, e)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {formatTime(notification.timestamp)}
                                                </div>

                                                {notification.type === "reservation" && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs">
                                                        <div className="flex items-center mb-1">
                                                            <User className="h-3 w-3 mr-1" />
                                                            <span>{notification.data.customerName}</span>
                                                        </div>
                                                        <div className="flex items-center mb-1">
                                                            <Car className="h-3 w-3 mr-1" />
                                                            <span>{notification.data.carName}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            <span>
                                                                {notification.data.startDate} ({notification.data.days} days)
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-right font-semibold">
                                                            ₱ {notification.data.totalPrice?.toLocaleString() || "N/A"}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
