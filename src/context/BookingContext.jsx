"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { useCars } from "./CarContext"
import { useNotifications } from "./NotificationContext"

// Create the booking context
const BookingContext = createContext(null)

// Initial booking data
const initialBookings = [
    {
        id: "B001",
        reservationId: "R001",
        carId: "1",
        userId: "user1",
        startDate: "2025-04-15",
        endDate: "2025-04-22",
        status: "Ongoing",
        totalPrice: 31500,
        paymentStatus: "Paid",
        createdAt: "2025-04-14T09:00:00Z",
        carName: "Toyota Camry",
    },
    {
        id: "B002",
        reservationId: "R003",
        carId: "3",
        userId: "user1",
        startDate: "2025-03-10",
        endDate: "2025-03-17",
        status: "Completed",
        totalPrice: 42000,
        paymentStatus: "Paid",
        createdAt: "2025-03-09T11:30:00Z",
        returnedAt: "2025-03-17T15:45:00Z",
        carName: "Honda Civic",
    },
]

export const BookingProvider = ({ children }) => {
    const { currentUser } = useAuth()
    const { updateCarAvailability, getCarById } = useCars()
    const { addNotification } = useNotifications()

    // Check if booking data exists in localStorage
    const storedBookings = localStorage.getItem("pahiramcar_bookings")
    const [bookings, setBookings] = useState(storedBookings ? JSON.parse(storedBookings) : initialBookings)
    const [loading, setLoading] = useState(true)

    // Update localStorage when bookings change
    useEffect(() => {
        localStorage.setItem("pahiramcar_bookings", JSON.stringify(bookings))
        setLoading(false)
    }, [bookings])

    // Add a new booking
    const addBooking = (booking) => {
        const bookingId = `B${Date.now().toString().slice(-6)}`
        const newBooking = {
            ...booking,
            id: bookingId,
            userId: currentUser?.id || "user1",
            createdAt: new Date().toISOString(),
            status: "Ongoing",
            paymentStatus: "Paid",
        }

        setBookings((prev) => [...prev, newBooking])

        // Update car availability
        updateCarAvailability(booking.carId, false)

        // Create notification for admin
        const car = getCarById(booking.carId)
        addNotification({
            type: "booking",
            title: "New Booking",
            message: `${currentUser?.fullName || booking.customerName} booked a ${car?.name}`,
            data: {
                bookingId,
                carId: booking.carId,
                carName: car?.name,
                customerName: currentUser?.fullName || booking.customerName,
                startDate: booking.startDate,
                endDate: booking.endDate,
                totalPrice: booking.totalPrice,
            },
        })

        return newBooking
    }

    // Update a booking
    const updateBooking = (updatedBooking) => {
        setBookings((prev) => prev.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)))
        return updatedBooking
    }

    // Complete a booking (return car)
    const completeBooking = (bookingId) => {
        const booking = bookings.find((b) => b.id === bookingId)
        if (booking) {
            // Update car availability
            updateCarAvailability(booking.carId, true)

            // Update booking status
            const updatedBooking = {
                ...booking,
                status: "Completed",
                returnedAt: new Date().toISOString(),
            }

            setBookings((prev) => prev.map((b) => (b.id === bookingId ? updatedBooking : b)))

            // Get car details
            const car = getCarById(booking.carId)

            // Create notification for admin
            addNotification({
                type: "return",
                title: "Car Returned",
                message: `${currentUser?.fullName || "Customer"} returned a ${car?.name}`,
                data: {
                    bookingId,
                    carId: booking.carId,
                    carName: car?.name,
                    customerName: currentUser?.fullName || "Customer",
                    returnDate: new Date().toISOString(),
                },
            })

            return updatedBooking
        }
        return null
    }

    // Get user bookings
    const getUserBookings = () => {
        if (!currentUser) return []
        return bookings
            .filter((b) => b.userId === currentUser.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort newest first
    }

    // Get active bookings
    const getActiveBookings = () => {
        return bookings.filter((b) => b.status === "Ongoing")
    }

    // Get completed bookings
    const getCompletedBookings = () => {
        return bookings.filter((b) => b.status === "Completed")
    }

    // Get bookings by car ID
    const getBookingsByCarId = (carId) => {
        return bookings.filter((b) => b.carId === carId)
    }

    return (
        <BookingContext.Provider
            value={{
                bookings,
                loading,
                addBooking,
                updateBooking,
                completeBooking,
                getUserBookings,
                getActiveBookings,
                getCompletedBookings,
                getBookingsByCarId,
            }}
        >
            {children}
        </BookingContext.Provider>
    )
}

// Custom hook to use the booking context
export const useBookings = () => {
    const context = useContext(BookingContext)
    if (!context) {
        throw new Error("useBookings must be used within a BookingProvider")
    }
    return context
}
