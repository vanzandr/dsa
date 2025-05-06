"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Car, Calendar, Clock, ArrowRight } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useReservations } from "../../context/ReservationContext"
import { useBookings } from "../../context/BookingContext"

export default function UserDashboard() {
    const { currentUser } = useAuth()
    const { getUserReservations } = useReservations()
    const { getUserBookings } = useBookings()

    const [activeReservations, setActiveReservations] = useState(0)
    const [activeRentals, setActiveRentals] = useState(0)
    const [completedRentals, setCompletedRentals] = useState(0)
    const [recentReservations, setRecentReservations] = useState([])
    const [recentTransactions, setRecentTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        try {
            if (currentUser) {
                // Get user reservations and active bookings
                const reservations = getUserReservations ? getUserReservations() : []
                const bookings = getUserBookings ? getUserBookings() : []

                // Count active reservations (not cancelled or converted)
                const activeReservs = reservations.filter(
                    (r) => r.status !== "Cancelled" && r.status !== "Converted to Booking",
                ).length

                // Count active rentals
                const activeRents = bookings.filter((b) => b.status === "Ongoing").length

                // Count completed rentals
                const completedRents = bookings.filter((b) => b.status === "Completed").length

                // Set state
                setActiveReservations(activeReservs)
                setActiveRentals(activeRents)
                setCompletedRentals(completedRents)

                // Recent Reservations - sort by date (newest first) and take only the first 5
                const sortedReservations = [...reservations]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)

                setRecentReservations(
                    sortedReservations.map((r) => ({
                        id: r.id,
                        carName: r.carName || "Car",
                        date: new Date(r.createdAt).toLocaleDateString(),
                        status: r.status,
                        timestamp: r.createdAt,
                        pickupDate: r.pickupDate,
                        returnDate: r.returnDate,
                    })),
                )

                // Recent Transactions - sort by date (newest first) and take only the first 5
                const sortedTransactions = [...bookings]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)

                setRecentTransactions(
                    sortedTransactions.map((b) => ({
                        id: b.id,
                        carName: b.carName || "Car",
                        date: new Date(b.createdAt).toLocaleDateString(),
                        status: b.status,
                        timestamp: b.createdAt,
                        amount: b.totalAmount || "N/A",
                        paymentStatus: b.paymentStatus || "Pending",
                    })),
                )
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err)
            setError("Failed to load dashboard data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }, [currentUser, getUserReservations, getUserBookings])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                        <p className="text-gray-700">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-6">
                            <img
                                src={currentUser?.avatar || "https://i.pravatar.cc/150?img=33"}
                                alt={currentUser?.fullName || "User"}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Welcome back, {currentUser?.fullName?.split(" ")[0] || "User"}!</h1>
                            <p className="text-gray-600">Manage your car rentals and reservations</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                            <h3 className="text-lg font-semibold">Active Reservations</h3>
                        </div>
                        <p className="text-3xl font-bold">{activeReservations}</p>
                        <Link to="/reserved-cars" className="text-blue-600 hover:underline text-sm flex items-center mt-2">
                            View all <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-2">
                            <Car className="h-5 w-5 text-green-500 mr-2" />
                            <h3 className="text-lg font-semibold">Active Rentals</h3>
                        </div>
                        <p className="text-3xl font-bold">{activeRentals}</p>
                        <Link to="/rented-cars" className="text-green-600 hover:underline text-sm flex items-center mt-2">
                            View all <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center mb-2">
                            <Clock className="h-5 w-5 text-purple-500 mr-2" />
                            <h3 className="text-lg font-semibold">Completed Rentals</h3>
                        </div>
                        <p className="text-3xl font-bold">{completedRentals}</p>
                        <Link to="/rental-history" className="text-purple-600 hover:underline text-sm flex items-center mt-2">
                            View history <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                    </div>
                </div>

                {/* Recent Reservations and Transactions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Recent Reservations */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold">Recent Reservations</h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {recentReservations.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No recent reservations</div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    {recentReservations.map((reservation) => (
                                        <div key={reservation.id} className="p-6 border-b border-gray-100">
                                            <div className="flex items-start">
                                                <div
                                                    className={`rounded-full p-2 mr-4 ${reservation.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                                                    }`}
                                                >
                                                    <Calendar className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium">{reservation.carName}</h3>
                                                        <span
                                                            className={`px-2 py-1 text-xs rounded-full ${reservation.status === "Active" || reservation.status === "Pending Confirmation"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : reservation.status === "Cancelled"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {reservation.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Pickup: {new Date(reservation.pickupDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Return: {new Date(reservation.returnDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Reserved on: {new Date(reservation.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold">Recent Transactions</h2>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {recentTransactions.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No recent transactions</div>
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    {recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="p-6 border-b border-gray-100">
                                            <div className="flex items-start">
                                                <div
                                                    className={`rounded-full p-2 mr-4 ${transaction.status === "Completed"
                                                        ? "bg-purple-100 text-purple-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                                >
                                                    <Car className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium">{transaction.carName}</h3>
                                                        <span
                                                            className={`px-2 py-1 text-xs rounded-full ${transaction.status === "Ongoing"
                                                                ? "bg-green-100 text-green-800"
                                                                : transaction.status === "Completed"
                                                                    ? "bg-purple-100 text-purple-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {transaction.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between mt-1">
                                                        <p className="text-sm text-gray-600">Amount: ${transaction.amount}</p>
                                                        <span
                                                            className={`px-2 py-1 text-xs rounded-full ${transaction.paymentStatus === "Paid"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {transaction.paymentStatus}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Transaction date: {new Date(transaction.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}