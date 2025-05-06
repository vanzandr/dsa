"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import UserCarDetailsModal from "../../components/UserCarDetailsModal"
import { useReservations } from "../../context/ReservationContext"
import { useCars } from "../../context/CarContext"
import { useAuth } from "../../context/AuthContext"
import { useNotifications } from "../../context/NotificationContext"

export default function ReservedCars() {
    const { currentUser } = useAuth()
    const { reservations, getUserReservations, cancelReservation } = useReservations()
    const { cars, getCarById } = useCars()
    const { addNotification } = useNotifications()

    const [userReservations, setUserReservations] = useState([])
    const [selectedCar, setSelectedCar] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState(null)
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })

    useEffect(() => {
        if (currentUser) {
            const userReservs = getUserReservations()

            // Map reservations to include car details
            const reservationsWithCarDetails = userReservs
                .filter((res) => res.status !== "Cancelled" && res.status !== "Converted to Booking")
                .map((reservation) => {
                    const car = getCarById(reservation.carId)
                    return {
                        ...reservation,
                        car: {
                            ...car,
                            reservationId: reservation.id,
                            startDate: reservation.startDate,
                            endDate: reservation.endDate,
                            totalPrice: reservation.totalPrice,
                            hasLicenseFile: reservation.hasLicenseFile,
                            hasContractFile: reservation.hasContractFile,
                        },
                    }
                })

            setUserReservations(reservationsWithCarDetails)
            setLoading(false)
        }
    }, [currentUser, reservations, cars])

    const handleViewDetails = (reservationCar) => {
        setSelectedCar(reservationCar.car)
        setShowDetailsModal(true)
    }

    const handleCloseModal = () => {
        setShowDetailsModal(false)
        setSelectedCar(null)
    }

    const handleCancelReservation = async (reservationId) => {
        if (window.confirm("Are you sure you want to cancel this reservation?")) {
            setCancellingId(reservationId)

            try {
                // Find the reservation to get car details before cancelling
                const reservation = userReservations.find((r) => r.id === reservationId)
                const car = reservation?.car

                // Cancel the reservation
                const success = cancelReservation(reservationId)

                if (success) {
                    // Update the UI
                    setUserReservations((prev) => prev.filter((item) => item.id !== reservationId))

                    // Add cancellation to recent activity
                    addNotification({
                        type: "cancellation",
                        title: "Reservation Cancelled",
                        message: `Your reservation for ${car?.name} has been cancelled`,
                        userId: currentUser.id,
                        data: {
                            reservationId,
                            carId: car?.id,
                            carName: car?.name,
                            timestamp: new Date().toISOString(),
                        },
                    })

                    // Show success message
                    setStatusMessage({
                        type: "success",
                        message: "Reservation cancelled successfully",
                    })
                } else {
                    // Show error message
                    setStatusMessage({
                        type: "error",
                        message: "Failed to cancel reservation",
                    })
                }

                // Hide status message after 3 seconds
                setTimeout(() => {
                    setStatusMessage({ type: "", message: "" })
                }, 3000)
            } catch (error) {
                console.error("Error cancelling reservation:", error)
                setStatusMessage({
                    type: "error",
                    message: "An error occurred while cancelling the reservation",
                })
            } finally {
                setCancellingId(null)
            }
        }
    }

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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link to="/browse-cars" className="flex items-center text-gray-600 hover:text-black">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go back to the Available Cars
                    </Link>

                    <div className="mt-4">
                        <h1 className="text-2xl font-bold">Reserved Cars</h1>
                        <p className="text-gray-600">Browse your reserved cars</p>
                    </div>
                </div>

                {statusMessage.message && (
                    <div
                        className={`mb-6 p-4 ${statusMessage.type === "success"
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

                {userReservations.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
                        <p className="text-gray-600 mb-4">You don't have any active reservations at the moment.</p>
                        <Link to="/browse-cars" className="px-4 py-2 bg-black text-white rounded-md inline-block">
                            Browse Cars
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {userReservations.map((reservation) => (
                            <div key={reservation.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <div className="relative">
                                    <img
                                        src={reservation.car.imageUrl || "/placeholder.svg"}
                                        alt={reservation.car.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <span
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${reservation.status === "Active" ? "bg-green-600 text-white" : "bg-yellow-500 text-white"
                                            }`}
                                    >
                                        {reservation.status}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{reservation.car.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{reservation.car.type}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <span className="text-xl font-bold">₱ {reservation.car.price}</span>
                                            <span className="text-gray-500 text-sm ml-1">per day</span>
                                        </div>
                                    </div>
                                    <div className="text-sm mb-4">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Start Date:</span>
                                            <span>{new Date(reservation.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">End Date:</span>
                                            <span>{new Date(reservation.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>Total:</span>
                                            <span>₱ {reservation.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Document indicators */}
                                    <div className="flex gap-2 mb-4">
                                        {reservation.hasLicenseFile && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                License
                                            </span>
                                        )}
                                        {reservation.hasContractFile && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Contract
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            className="px-4 py-2 border border-black rounded-lg text-sm hover:bg-gray-50"
                                            onClick={() => handleViewDetails(reservation)}
                                        >
                                            Details
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                                            onClick={() => handleCancelReservation(reservation.id)}
                                            disabled={cancellingId === reservation.id}
                                        >
                                            {cancellingId === reservation.id ? (
                                                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                            ) : null}
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showDetailsModal && selectedCar && (
                <UserCarDetailsModal car={selectedCar} type="reserved" onClose={handleCloseModal} />
            )}
        </div>
    )
}
