"use client"

import { useState, useEffect } from "react"
import { Search, AlertCircle, CheckCircle } from "lucide-react"
import AdminSidebar from "./components/AdminSidebar.jsx"
import ReservationModal from "./components/ReservationModal"
import PaymentModal from "./components/PaymentModal"
import { useReservations } from "../../context/ReservationContext"
import { useCars } from "../../context/CarContext"
import { useBookings } from "../../context/BookingContext"

export default function AdminReservations() {
    const { reservations, updateReservation, cancelReservation } = useReservations()
    const { cars, getCarById } = useCars()
    const { addBooking } = useBookings()

    const [filter, setFilter] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [showReservationModal, setShowReservationModal] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [filteredReservations, setFilteredReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionInProgress, setActionInProgress] = useState(null)
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })

    useEffect(() => {
        if (reservations.length > 0 && cars.length > 0) {
            const processedReservations = reservations.map((reservation) => {
                const car = getCarById(reservation.carId)
                return {
                    ...reservation,
                    car: car ? car.name : "Unknown Car",
                    customer: reservation.customerName || "Unknown Customer",
                }
            })

            // Sort by creation date, newest first
            processedReservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

            setFilteredReservations(processedReservations)
            setLoading(false)
        }
    }, [reservations, cars])

    // Filter reservations based on selected filter and search term
    useEffect(() => {
        if (loading) return

        let result = [...reservations].map((reservation) => {
            const car = getCarById(reservation.carId)
            return {
                ...reservation,
                car: car ? car.name : "Unknown Car",
                customer: reservation.customerName || "Unknown Customer",
            }
        })

        // Sort by creation date, newest first
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

        // Apply filter
        if (filter !== "all") {
            if (filter === "active") result = result.filter((r) => r.status === "Active")
            if (filter === "pending") result = result.filter((r) => r.status === "Waiting for Approval")
            if (filter === "cancelled") result = result.filter((r) => r.status === "Cancelled")
        }

        // Apply search
        if (searchTerm) {
            result = result.filter(
                (r) =>
                    r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.car.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        setFilteredReservations(result)
    }, [filter, searchTerm, loading])

    const handleBookNow = (reservation) => {
        setSelectedReservation(reservation)
        setShowReservationModal(true)
    }

    const handleDirectPayment = (reservation) => {
        setSelectedReservation(reservation)
        setShowPaymentModal(true)
    }

    const handleCloseReservationModal = () => {
        setShowReservationModal(false)
        setSelectedReservation(null)
    }

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false)
    }

    const handleConfirmReservation = async (reservationId) => {
        setActionInProgress(reservationId)

        try {
            // Update reservation status to Active
            const updatedReservation = {
                ...reservations.find((r) => r.id === reservationId),
                status: "Active",
            }

            updateReservation(updatedReservation)

            // Update UI
            setFilteredReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, status: "Active" } : r)))

            // Show success message
            setStatusMessage({
                type: "success",
                message: "Reservation confirmed successfully",
            })

            // Clear message after 3 seconds
            setTimeout(() => {
                setStatusMessage({ type: "", message: "" })
            }, 3000)
        } catch (error) {
            console.error("Error confirming reservation:", error)
            setStatusMessage({
                type: "error",
                message: "Failed to confirm reservation",
            })
        } finally {
            setActionInProgress(null)
        }
    }

    const handleCancelReservation = async (reservationId) => {
        if (window.confirm("Are you sure you want to cancel this reservation?")) {
            setActionInProgress(reservationId)

            try {
                cancelReservation(reservationId)

                // Update UI
                setFilteredReservations((prev) => prev.map((r) => (r.id === reservationId ? { ...r, status: "Cancelled" } : r)))

                // Show success message
                setStatusMessage({
                    type: "success",
                    message: "Reservation cancelled successfully",
                })

                // Clear message after 3 seconds
                setTimeout(() => {
                    setStatusMessage({ type: "", message: "" })
                }, 3000)
            } catch (error) {
                console.error("Error cancelling reservation:", error)
                setStatusMessage({
                    type: "error",
                    message: "Failed to cancel reservation",
                })
            } finally {
                setActionInProgress(null)
            }
        }
    }

    const handlePaymentComplete = (paymentDetails) => {
        if (!selectedReservation) return

        // Create a booking from the reservation
        const car = getCarById(selectedReservation.carId)
        const booking = {
            carId: selectedReservation.carId,
            carName: car ? car.name : "Unknown Car",
            userId: selectedReservation.userId,
            customerName: selectedReservation.customer,
            startDate: selectedReservation.startDate,
            endDate: selectedReservation.endDate,
            totalPrice: selectedReservation.totalPrice,
            paymentStatus: "Paid",
            paymentMethod: paymentDetails.method,
        }

        // Add booking
        addBooking(booking)

        // Update reservation status
        const updatedReservation = {
            ...selectedReservation,
            status: "Converted to Booking",
        }
        updateReservation(updatedReservation)

        // Update UI
        setFilteredReservations((prev) =>
            prev.map((r) => (r.id === selectedReservation.id ? { ...r, status: "Converted to Booking" } : r)),
        )

        // Show success message
        setStatusMessage({
            type: "success",
            message: "Reservation converted to booking successfully",
        })

        // Clear message after 3 seconds
        setTimeout(() => {
            setStatusMessage({ type: "", message: "" })
        }, 3000)

        setShowPaymentModal(false)
        setSelectedReservation(null)
    }

    // Function to determine the appropriate action button based on reservation status
    const renderActionButton = (reservation) => {
        const isProcessing = actionInProgress === reservation.id

        switch (reservation.status) {
            case "Active":
                return (
                    <button
                        onClick={() => handleBookNow(reservation)}
                        className="px-4 py-2 bg-black text-white rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : "Book Now"}
                    </button>
                )
            case "Waiting for Approval":
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleConfirmReservation(reservation.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Confirm"}
                        </button>
                        <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing..." : "Cancel"}
                        </button>
                    </div>
                )
            case "Expired":
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-200 text-gray-800">
            Expired
          </span>
                )
            case "Converted to Booking":
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-200 text-green-800">
            Converted
          </span>
                )
            case "Cancelled":
                return (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-gray-200 text-gray-800">
            Cancelled
          </span>
                )
            default:
                return (
                    <button
                        onClick={() => handleBookNow(reservation)}
                        className="px-4 py-2 bg-black text-white rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : "Book Now"}
                    </button>
                )
        }
    }

    // Function to determine the status badge style
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-800"
            case "Waiting for Approval":
                return "bg-yellow-100 text-yellow-800"
            case "Expired":
                return "bg-gray-100 text-gray-800"
            case "Converted to Booking":
                return "bg-blue-100 text-blue-800"
            case "Cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar active="reservations" />
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
            <AdminSidebar active="reservations" />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Reservations</h1>
                    <p className="text-gray-600">View and manage car reservations</p>
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
                            onClick={() => setFilter("active")}
                            className={`px-4 py-2 rounded-md ${filter === "active" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-4 py-2 rounded-md ${filter === "pending" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter("cancelled")}
                            className={`px-4 py-2 rounded-md ${filter === "cancelled" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>
                {/* Reservations Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredReservations.length === 0 ? (
                        <div className="p-8 text-center">
                            <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
                            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reservation ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Car
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reservation Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expiration Date
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
                            {filteredReservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.car}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(reservation.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(reservation.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(reservation.status)}`}
                      >
                        {reservation.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {renderActionButton(reservation)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Reservation Modal */}
            {showReservationModal && selectedReservation && (
                <ReservationModal reservation={selectedReservation} onClose={handleCloseReservationModal} />
            )}

            {/* Direct Payment Modal */}
            {showPaymentModal && selectedReservation && (
                <PaymentModal
                    booking={{
                        carName: selectedReservation.car,
                        price: selectedReservation.totalPrice / 7, // Estimate daily price
                        days: 7,
                        totalAmount: selectedReservation.totalPrice,
                    }}
                    onClose={handleClosePaymentModal}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}
        </div>
    )
}
