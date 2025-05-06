"use client"

import { useState, useEffect } from "react"
import { useCars } from "../../../context/CarContext"

export default function EmployeeReservationModal({ reservation, onClose, readOnly = false }) {
    const { getCarById } = useCars()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!reservation) return

        const carData = getCarById(reservation.carId)
        if (carData) setCar(carData)
    }, [reservation, getCarById])

    if (!reservation || !car) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-8">
                    <p>Loading reservation details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Car Details */}
                    <div className="bg-gray-50 p-8">
                        <img src={car.imageUrl || "/placeholder.svg"} alt={car.name} className="w-full h-auto rounded-lg mb-6" />

                        <h2 className="text-2xl font-bold">{car.name}</h2>
                        <p className="text-gray-600 mb-4">{car.type}</p>

                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-2xl font-bold">₱ {car.price}</span>
                                <span className="text-gray-500 text-sm ml-1">per day</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                <span className="text-sm">{car.seats} Seats</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                <span className="text-sm">{car.transmission}</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                <span className="text-sm">{car.fuelType}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <h3 className="font-medium mb-2">Plate Number</h3>
                                <p className="text-gray-700">{car.plateNumber || "DIWATA009"}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Chassis Number</h3>
                                <p className="text-gray-700">{car.chassisNumber || "N/A"}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium mb-2">Start Date</h3>
                                <p className="text-gray-700">{new Date(reservation.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">End Date</h3>
                                <p className="text-gray-700">{new Date(reservation.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="p-8">
                        <h2 className="text-xl font-bold mb-6">Reservation Information</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Customer Name</h3>
                                    <p className="text-gray-900">{reservation.customer || reservation.customerName}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Contact Number</h3>
                                    <p className="text-gray-900">{reservation.mobilePhone || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Reservation ID</h3>
                                    <p className="text-gray-900">{reservation.id}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Reservation Date</h3>
                                    <p className="text-gray-900">{new Date(reservation.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Reservation Summary</h3>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Amount Due</span>
                                    <span>
                    ₱ {car.price} x {Math.round(reservation.totalPrice / car.price)} days
                  </span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>₱ {reservation.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                                <span
                                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                        reservation.status === "Active"
                                            ? "bg-green-100 text-green-800"
                                            : reservation.status === "Waiting for Approval"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : reservation.status === "Cancelled"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                  {reservation.status}
                </span>
                            </div>

                            <div className="flex justify-end">
                                <button onClick={onClose} className="px-4 py-2 bg-black text-white rounded-md">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
