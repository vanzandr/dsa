"use client"


import { useState, useEffect } from "react"
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"
import UserCarDetailsModal from "../../components/UserCarDetailsModal"
import { useBookings } from "../../context/BookingContext"
import { useCars } from "../../context/CarContext"
import { useAuth } from "../../context/AuthContext"
import { useNotifications } from "../../context/NotificationContext"

export default function RentedCars() {
    const { currentUser } = useAuth()
    const { bookings, getUserBookings, completeBooking } = useBookings()
    const { cars, getCarById } = useCars()
    const { addNotification } = useNotifications()

    const [userBookings, setUserBookings] = useState([])
    const [selectedCar, setSelectedCar] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [returningId, setReturningId] = useState(null)
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })

    useEffect(() => {
        if (currentUser) {
            const userActiveBookings = getUserBookings().filter((booking) => booking.status === "Ongoing")

            // Map bookings to include car details
            const bookingsWithCarDetails = userActiveBookings.map((booking) => {
                const car = getCarById(booking.carId)

                // Check if the booking is due
                const endDate = new Date(booking.endDate)
                const today = new Date()
                const isDue = today > endDate

                return {
                    ...booking,
                    car: {
                        ...car,
                        bookingId: booking.id,
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        returnDate: booking.endDate,
                        totalPrice: booking.totalPrice,
                        isDue,
                        isReturned: booking.status === "Completed",
                    },
                }
            })

            setUserBookings(bookingsWithCarDetails)
            setLoading(false)
        }
    }, [currentUser, bookings, cars])

    const handleViewDetails = (bookingCar) => {
        setSelectedCar(bookingCar.car)
        setShowDetailsModal(true)
    }

    const handleCloseModal = () => {
        setShowDetailsModal(false)
        setSelectedCar(null)
    }

    const handleReturnCar = async (bookingId) => {
        if (window.confirm("Are you sure you want to return this car?")) {
            setReturningId(bookingId)

            try {
                // Find the booking to get car details before completing
                const booking = userBookings.find((b) => b.id === bookingId)
                const car = booking?.car

                // Complete the booking (mark as returned)
                const success = completeBooking(bookingId)

                if (success) {
                    // Update the UI
                    setUserBookings((prev) => prev.filter((item) => item.id !== bookingId))

                    // Add return notification if notification context is available
                    if (addNotification) {
                        addNotification({
                            type: "return",
                            title: "Car Returned",
                            message: `You have successfully returned ${car?.name}`,
                            userId: currentUser.id,
                            data: {
                                bookingId,
                                carId: car?.id,
                                carName: car?.name,
                                timestamp: new Date().toISOString(),
                            },
                        })
                    }

                    // Show success message
                    setStatusMessage({
                        type: "success",
                        message: "Car returned successfully",
                    })
                } else {
                    // Show error message
                    setStatusMessage({
                        type: "error",
                        message: "Failed to return car",
                    })
                }

                // Hide status message after 3 seconds
                setTimeout(() => {
                    setStatusMessage({ type: "", message: "" })
                }, 3000)
            } catch (error) {
                console.error("Error returning car:", error)
                setStatusMessage({
                    type: "error",
                    message: "An error occurred while returning the car",
                })
            } finally {
                setReturningId(null)
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
                        <h1 className="text-2xl font-bold">Rented Cars</h1>
                        <p className="text-gray-600">Browse your ongoing rented cars</p>
                    </div>
                </div>

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

                {userBookings.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <h3 className="text-lg font-semibold mb-2">No active rentals found</h3>
                        <p className="text-gray-600 mb-4">You don't have any active car rentals at the moment.</p>
                        <Link to="/browse-cars" className="px-4 py-2 bg-black text-white rounded-md inline-block">
                            Browse Cars
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {userBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <div className="relative">
                                    <img
                                        src={booking.car.imageUrl || "/placeholder.svg"}
                                        alt={booking.car.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <span
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
                                            booking.car.isDue ? "bg-red-600 text-white" : "bg-green-600 text-white"
                                        }`}
                                    >
                    {booking.car.isDue
                        ? "Due already"
                        : `Return before ${new Date(booking.car.returnDate).toLocaleDateString()}`}
                  </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{booking.car.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{booking.car.type}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <span className="text-xl font-bold">₱ {booking.car.price}</span>
                                            <span className="text-gray-500 text-sm ml-1">per day</span>
                                        </div>
                                    </div>
                                    <div className="text-sm mb-4">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Start Date:</span>
                                            <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Return Date:</span>
                                            <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>Total:</span>
                                            <span>₱ {booking.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        {booking.car.isDue ? (
                                            <span className="text-sm text-red-600">Due already</span>
                                        ) : (
                                            <span className="text-sm text-green-600">Ongoing</span>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                className="px-4 py-2 border border-black rounded-lg text-sm hover:bg-gray-50"
                                                onClick={() => handleViewDetails(booking)}
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                                                onClick={() => handleReturnCar(booking.id)}
                                                disabled={returningId === booking.id}
                                            >
                                                {returningId === booking.id ? (
                                                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                                ) : null}
                                                Return
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showDetailsModal && selectedCar && (
                <UserCarDetailsModal car={selectedCar} type="rented" onClose={handleCloseModal} />
            )}
        </div>
    )
}
