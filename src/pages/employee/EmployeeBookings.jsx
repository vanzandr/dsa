"use client"

import { useState, useEffect } from "react"
import { Search, AlertCircle, CheckCircle } from "lucide-react"
import EmployeeSidebar from "./components/EmployeeSidebar.jsx"
import { useBookings } from "../../context/BookingContext"
import { useCars } from "../../context/CarContext"
import BookingDetailsModal from "../admin/components/BookingDetailsModal.jsx";

export default function EmployeeBookings() {
    const { bookings } = useBookings()
    const { cars, getCarById } = useCars()

    const [filter, setFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [filteredBookings, setFilteredBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })

    useEffect(() => {
        if (bookings.length > 0 && cars.length > 0) {
            const processedBookings = bookings.map((booking) => {
                const car = getCarById(booking.carId)
                return {
                    ...booking,
                    car: car ? car.name : "Unknown Car",
                    customer: booking.customerName || "Unknown Customer",
                }
            })

            // Sort by creation date, newest first
            processedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

            setFilteredBookings(processedBookings)
            setLoading(false)
        }
    }, [bookings, cars])

    // Filter bookings based on selected filter and search term
    useEffect(() => {
        if (loading) return

        let result = [...bookings].map((booking) => {
            const car = getCarById(booking.carId)
            return {
                ...booking,
                car: car ? car.name : "Unknown Car",
                customer: booking.customerName || "Unknown Customer",
            }
        })

        // Sort by creation date, newest first
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        // Apply filter
        if (filter !== "all") {
            if (filter === "ongoing") result = result.filter((b) => b.status === "Ongoing")
            if (filter === "completed") result = result.filter((b) => b.status === "Completed")
            if (filter === "cancelled") result = result.filter((b) => b.status === "Cancelled")
        }

        // Apply search
        if (searchTerm) {
            result = result.filter(
                (b) =>
                    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.car.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        setFilteredBookings(result)
    }, [filter, searchTerm, loading])

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking)
        setShowBookingModal(true)
    }

    const handleCloseBookingModal = () => {
        setShowBookingModal(false)
        setSelectedBooking(null)
    }

    // Function to determine the status badge style
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Ongoing":
                return "bg-green-100 text-green-800"
            case "Completed":
                return "bg-blue-100 text-blue-800"
            case "Cancelled":
                return "bg-red-100 text-red-800"
            case "Overdue":
                return "bg-yellow-100 text-yellow-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleUpdateStatus = (bookingId, newStatus) => {
        // Update booking status logic would go here
        // This is a placeholder for demonstration
        setFilteredBookings((prev) =>
            prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
        )

        setStatusMessage({
            type: "success",
            message: `Booking status updated to ${newStatus}`,
        })

        setTimeout(() => {
            setStatusMessage({ type: "", message: "" })
        }, 3000)
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <EmployeeSidebar active="bookings" />
                <div className="flex-1 p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <EmployeeSidebar active="bookings" />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Bookings</h1>
                    <p className="text-gray-600">View car bookings</p>
                </div>

                {/* Status Message */}
                {statusMessage.message && (
                    <div
                        className={`mb-6 p-4 ${
                            statusMessage.type === "success"
                                ? "bg-green-50 border border-green-200 text-green-700"
                                : "bg-red-50 border border-red-200 text-red-700"
                        } rounded-md flex items-center`}
                    >
                        {statusMessage.type === "success" ? (
                            <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                            <AlertCircle className="h-5 w-5 mr-2" />
                        )}
                        {statusMessage.message}
                    </div>
                )}

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search name or ID"
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("ongoing")}
                            className={`px-4 py-2 rounded-md ${filter === "ongoing" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            Ongoing
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-4 py-2 rounded-md ${filter === "completed" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilter("cancelled")}
                            className={`px-4 py-2 rounded-md ${filter === "cancelled" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>
                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredBookings.length === 0 ? (
                        <div className="p-8 text-center">
                            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.car}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(booking.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col space-y-1">
                                            <button onClick={() => handleViewDetails(booking)} className="text-black hover:underline">
                                                View Details
                                            </button>
                                            {booking.status === "Ongoing" && (
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, "Completed")}
                                                    className="text-green-600 hover:underline text-xs"
                                                >
                                                    Mark as Completed
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedBooking && (
                <BookingDetailsModal booking={selectedBooking} onClose={handleCloseBookingModal} />
            )}
        </div>
    )
}
