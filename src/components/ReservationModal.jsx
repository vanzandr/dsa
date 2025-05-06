"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, AlertCircle, Download, FileText, CreditCard } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNotifications } from "../context/NotificationContext"
import { useReservations } from "../context/ReservationContext"

export default function ReservationModal({ car, onClose, onReserve }) {
    const { currentUser, isAuthenticated } = useAuth()
    const { addNotification } = useNotifications()
    const { addReservation } = useReservations()

    const [selectedDays, setSelectedDays] = useState(7)
    const [startDate, setStartDate] = useState("")
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Calculate today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split("T")[0]

    // Set default start date to today
    useEffect(() => {
        setStartDate(today)
    }, [today])

    // Calculate end date based on start date and selected days
    const calculateEndDate = () => {
        if (!startDate) return ""
        const date = new Date(startDate)
        date.setDate(date.getDate() + selectedDays)
        return date.toISOString().split("T")[0]
    }

    // Calculate costs
    const rentalCost = car?.price * selectedDays
    const securityDeposit = 5000
    const totalPrice = rentalCost + securityDeposit

    const downloadContract = (e) => {
        e.preventDefault()
        // In a real application, this would download an actual contract file
        alert("Contract template would be downloaded here")
    }

    const validateForm = () => {
        const newErrors = {}

        if (!startDate) {
            newErrors.startDate = "Start date is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Create reservation object with user information
            const reservation = {
                carId: car.id,
                startDate,
                endDate: calculateEndDate(),
                days: selectedDays,
                totalPrice: rentalCost,
                securityDeposit: securityDeposit,
                status: "Pending Confirmation",
                createdAt: new Date().toISOString(),
                // Include user information
                customerName: currentUser
                    ? `${currentUser.firstName} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.surname}`
                    : "Guest User",
                firstName: currentUser?.firstName || "",
                middleName: currentUser?.middleName || "",
                surname: currentUser?.surname || "",
                contactNumber: currentUser?.phone || "",
                nationality: currentUser?.nationality || "Filipino",
            }

            // Add reservation to context
            const newReservation = addReservation(reservation)

            // Add notification for the user
            addNotification({
                type: "reservation",
                title: "Car Reserved",
                message: `You have successfully reserved a ${car.name}`,
                data: {
                    reservationId: newReservation.id,
                    carId: car.id,
                    carName: car.name,
                    startDate: startDate,
                    days: selectedDays,
                    totalPrice: totalPrice,
                },
            })

            // Call the onReserve callback with the reservation data
            if (onReserve) {
                onReserve(newReservation)
            }

            onClose()
        } catch (error) {
            console.error("Error creating reservation:", error)
            setErrors({ submit: "Failed to create reservation. Please try again." })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black text-white p-1 rounded-full z-10">
                        <X size={20} />
                    </button>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6">Reserve Car</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div>
                                <img
                                    src={car.images?.[0] || car.imageUrl || "/placeholder.svg"}
                                    alt={car.name}
                                    className="w-full h-auto rounded-lg"
                                />

                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">{car.name}</h3>
                                    <p className="text-gray-600 mb-3">{car.type}</p>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <span className="text-xl font-bold">₱ {car.price}</span>
                                            <span className="text-gray-500 text-sm ml-1">per day</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="flex items-center gap-1">
                                            <span>{car.seats} Seats</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>{car.transmission}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>{car.fuelType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Required Documents Section - Now at the top */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Required Documents</h3>

                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-start mb-3">
                                                <FileText className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-sm">Valid ID</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Please bring a valid government-issued ID when picking up the vehicle
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start mb-3">
                                                <FileText className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-sm">Driver's License</h4>
                                                    <p className="text-sm text-gray-600">
                                                        A valid driver's license is required to rent this vehicle
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <FileText className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-sm">Rental Contract</h4>
                                                    <div className="flex items-center mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={downloadContract}
                                                            className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Download Contract Template
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Download, sign, and bring the contract when picking up the vehicle
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Start Date and Rental Duration - Now after required documents */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="mr-2" />
                                                Start Date
                                            </div>
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value)
                                                if (errors.startDate) {
                                                    setErrors((prev) => ({ ...prev, startDate: null }))
                                                }
                                            }}
                                            min={today}
                                            className={`w-full rounded-md border ${errors.startDate ? "border-red-500" : "border-gray-300"} px-3 py-2`}
                                            required
                                        />
                                        {errors.startDate && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="h-4 w-4 mr-1" />
                                                {errors.startDate}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            <div className="flex items-center">
                                                <Clock size={16} className="mr-2" />
                                                Rental Duration
                                            </div>
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="range"
                                                min="1"
                                                max="30"
                                                value={selectedDays}
                                                onChange={(e) => setSelectedDays(Number.parseInt(e.target.value))}
                                                className="w-full mr-4"
                                            />
                                            <span className="font-medium">{selectedDays} days</span>
                                        </div>
                                    </div>

                                    {/* Reservation Summary - Updated to "Estimated Rental Cost" */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h3 className="font-medium mb-2 flex items-center">
                                            <CreditCard className="h-5 w-5 mr-2" />
                                            Estimated Rental Cost
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Rental Cost</span>
                                                <span>
                          ₱ {car?.price} x {selectedDays} days = ₱ {rentalCost?.toLocaleString()}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Security Deposit (Refundable)</span>
                                                <span>₱ {securityDeposit?.toLocaleString()}</span>
                                            </div>
                                            <div className="h-px bg-gray-200 my-2"></div>
                                            <div className="flex justify-between font-bold">
                                                <span>Total</span>
                                                <span>₱ {totalPrice?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 italic">
                                        By reserving this car, you agree to our terms and conditions. The car will be held for you for 3
                                        days.
                                    </div>

                                    {errors.submit && (
                                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                                            <AlertCircle className="h-5 w-5 mr-2" />
                                            {errors.submit}
                                        </div>
                                    )}

                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 border border-gray-300 rounded-md"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <span className="flex items-center">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                          Processing...
                        </span>
                                            ) : (
                                                "Complete Reservation"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}