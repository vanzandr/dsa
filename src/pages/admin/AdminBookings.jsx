"use client"

import { useState, useEffect } from "react"
import { Search, Check, AlertCircle } from "lucide-react"
import AdminSidebar from "./components/AdminSidebar.jsx"
import BookingDetailsModal from "./components/BookingDetailsModal"
import ReturnCarModal from "./components/return-car-modal"
import { useBookings } from "../../context/BookingContext"
import { useCars } from "../../context/CarContext"
import { useNotifications } from "../../context/NotificationContext"



export default function AdminBookings() {
    const { bookings, updateBooking, completeBooking, cancelBooking } = useBookings()
    const { cars, getCarById, updateCar } = useCars()
    const { addNotification } = useNotifications()

    const [filter, setFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [showReturnModal, setShowReturnModal] = useState(false)
    const [filteredBookings, setFilteredBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })

    // Process bookings with car details
    useEffect(() => {
        if (bookings.length > 0 && cars.length > 0) {
            const processedBookings = bookings.map((booking) => {
                const car = getCarById(booking.carId)

                // Check if the booking is overdue
                const endDate = new Date(booking.endDate)
                const today = new Date()
                const isOverdue = booking.status === "Ongoing" && today > endDate

                // Calculate overdue hours and fee if overdue
                let overdueHours = 0
                let overdueFee = 0

                if (isOverdue) {
                    // Calculate hours difference
                    const diffMs = today - endDate
                    overdueHours = Math.ceil(diffMs / (1000 * 60 * 60)) // Convert ms to hours and round up
                    overdueFee = overdueHours * 300 // 300 per hour
                }

                return {
                    ...booking,
                    car: car ? car.name : booking.carName || "Unknown Car",
                    customer: booking.customerName || "Unknown Customer",
                    status: isOverdue ? "Overdue" : booking.status,
                    actionRequired: isOverdue || booking.paymentStatus === "Pending",
                    overdueHours: overdueHours,
                    overdueFee: overdueFee,
                }
            })

            setFilteredBookings(processedBookings)
            setLoading(false)
        }
    }, [bookings, cars])

    // Filter bookings based on selected filter and search term
    useEffect(() => {
        if (loading) return

        let result = [...bookings].map((booking) => {
            const car = getCarById(booking.carId)

            // Check if the booking is overdue
            const endDate = new Date(booking.endDate)
            const today = new Date()
            const isOverdue = booking.status === "Ongoing" && today > endDate

            // Calculate overdue hours and fee if overdue
            let overdueHours = 0
            let overdueFee = 0

            if (isOverdue) {
                // Calculate hours difference
                const diffMs = today - endDate
                overdueHours = Math.ceil(diffMs / (1000 * 60 * 60)) // Convert ms to hours and round up
                overdueFee = overdueHours * 300 // 300 per hour
            }

            return {
                ...booking,
                car: car ? car.name : booking.carName || "Unknown Car",
                customer: booking.customerName || "Unknown Customer",
                status: isOverdue ? "Overdue" : booking.status,
                actionRequired: isOverdue,
                overdueHours: overdueHours,
                overdueFee: overdueFee,
            }
        })

        // Apply filter
        if (filter !== "all") {
            if (filter === "ongoing") result = result.filter((b) => b.status === "Ongoing")
            if (filter === "completed") result = result.filter((b) => b.status === "Completed")
            if (filter === "overdue") result = result.filter((b) => b.status === "Overdue")
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

    const handleViewBooking = (booking) => {
        // Get the full car details including chassis number
        const car = getCarById(booking.carId)

        // Create an enhanced booking object with complete car details
        const enhancedBooking = {
            ...booking,
            carDetails: car
                ? {
                    ...car,
                    chassisNumber: car.chassisNumber || "N/A",
                }
                : null,
        }

        setSelectedBooking(enhancedBooking)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedBooking(null)
    }

    const handleReturnCar = (booking) => {
        // Get the full car details including chassis number
        const car = getCarById(booking.carId)

        // Create an enhanced booking object with complete car details
        const enhancedBooking = {
            ...booking,
            carDetails: car
                ? {
                    ...car,
                    chassisNumber: car.chassisNumber || "N/A",
                }
                : null,
        }

        setSelectedBooking(enhancedBooking)
        setShowReturnModal(true)
    }

    const handleCloseReturnModal = () => {
        setShowReturnModal(false)
        setSelectedBooking(null)
    }

    const handleCompleteReturn = async (returnData) => {
        try {
            // 1. Update the booking status
            const updatedBooking = {
                ...selectedBooking,
                status: "Completed",
                returnDate: returnData.returnDate,
                damageAssessment: returnData.damageAssessment,
                overdueFee: returnData.overdueFee,
                overdueHours: returnData.overdueHours,
                overduePayment: returnData.overduePayment,
            }

            completeBooking(selectedBooking.id, updatedBooking)

            // 2. Update the car availability
            const car = getCarById(selectedBooking.carId)
            if (car) {
                const updatedCar = {
                    ...car,
                    available: true,
                }
                updateCar(car.id, updatedCar)
            }

            // 3. Add notification
            if (addNotification) {
                addNotification({
                    type: "car-return",
                    title: "Car Returned",
                    message: `${selectedBooking.car} has been returned by ${selectedBooking.customer}`,
                    data: {
                        bookingId: selectedBooking.id,
                        carId: selectedBooking.carId,
                        returnDate: returnData.returnDate,
                        hasDamage: returnData.damageAssessment.hasDamage,
                    },
                })
            }

            // 4. Update UI
            setFilteredBookings((prev) =>
                prev.map((b) =>
                    b.id === selectedBooking.id
                        ? {
                            ...b,
                            status: "Completed",
                            damageAssessment: returnData.damageAssessment,
                            overdueFee: returnData.overdueFee,
                            overdueHours: returnData.overdueHours,
                            overduePayment: returnData.overduePayment,
                        }
                        : b,
                ),
            )

            // 5. Show success message
            setStatusMessage({
                type: "success",
                message: `Car returned successfully${
                    returnData.damageAssessment.hasDamage ? " with damage assessment" : " with no damage"
                }`,
            })

            // Clear message after 3 seconds
            setTimeout(() => {
                setStatusMessage({ type: "", message: "" })
            }, 3000)

            return true
        } catch (error) {
            console.error("Error completing car return:", error)
            setStatusMessage({
                type: "error",
                message: "Failed to process car return",
            })
            return false
        }
    }

    const handleCancelBooking = (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            cancelBooking(bookingId)

            // Update UI
            setFilteredBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" } : b)))
        }
    }

    // Function to determine the status badge style
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Ongoing":
                return "bg-green-100 text-green-800"
            case "Overdue":
                return "bg-red-100 text-red-800"
            case "Confirmed":
                return "bg-blue-100 text-blue-800"
            case "Completed":
                return "bg-purple-100 text-purple-800"
            case "Cancelled":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Function to determine the payment status badge style
    const getPaymentStatusBadgeClass = (status) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-800"
            case "Pending":
                return "bg-yellow-100 text-yellow-800"
            case "Refunded":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar active="bookings" />
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
            <AdminSidebar active="bookings" />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Bookings</h1>
                    <p className="text-gray-600">View and manage customer bookings</p>
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
                            <Check className="h-5 w-5 mr-2" />
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
                            placeholder="Search booking ID or customer"
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
                            onClick={() => setFilter("overdue")}
                            className={`px-4 py-2 rounded-md ${filter === "overdue" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            Overdue
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
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₱ {booking.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                                        {booking.actionRequired && (
                                            <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          !
                        </span>
                                        )}
                                        {booking.damageAssessment?.hasDamage && (
                                            <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          Damaged
                        </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleViewBooking(booking)} className="text-black hover:underline">
                                                View
                                            </button>
                                            {(booking.status === "Ongoing" || booking.status === "Overdue") && (
                                                <button onClick={() => handleReturnCar(booking)} className="text-green-600 hover:underline">
                                                    Return Car
                                                </button>
                                            )}
                                            {(booking.status === "Ongoing" || booking.status === "Confirmed") && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="text-red-600 hover:underline"
                                                >
                                                    Cancel
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

            {/* Booking Details Modal */}
            {showModal && selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={handleCloseModal} />}

            {/* Return Car Modal */}
            {showReturnModal && selectedBooking && (
                <ReturnCarModal booking={selectedBooking} onClose={handleCloseReturnModal} onComplete={handleCompleteReturn} />
            )}
        </div>
    )
}
