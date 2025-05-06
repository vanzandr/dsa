"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { useBookings } from "../../context/BookingContext"

export default function RentalHistory() {
    const { currentUser } = useAuth()
    const { getUserBookings } = useBookings()
    const [rentalHistory, setRentalHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (currentUser) {
            // Get all user bookings and sort by date (newest first)
            const userBookings = getUserBookings().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

            setRentalHistory(userBookings)
            setLoading(false)
        }
    }, [currentUser])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link to="/profile" className="flex items-center text-gray-600 hover:text-black">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Profile
                    </Link>

                    <div className="mt-4">
                        <h1 className="text-2xl font-bold">Rental History</h1>
                        <p className="text-gray-600">View your past and current rentals</p>
                    </div>
                </div>

                {/* Rental History */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {rentalHistory.length === 0 ? (
                        <div className="p-8 text-center">
                            <h3 className="text-lg font-semibold mb-2">No rental history found</h3>
                            <p className="text-gray-600 mb-4">You don't have any rental history at the moment.</p>
                            <Link to="/browse-cars" className="px-4 py-2 bg-black text-white rounded-md inline-block">
                                Browse Cars
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Booking ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Car
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            End Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rentalHistory.map((booking) => (
                                        <tr key={booking.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.carName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(booking.startDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(booking.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ₱ {booking.totalPrice.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === "Ongoing"
                                                            ? "bg-green-100 text-green-800"
                                                            : booking.status === "Overdue"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
