"use client"

import { useState } from "react"
import { X, Users, Fuel, Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import ImageCarousel from "./ImageCarousel"

export default function UserCarDetailsModal({ car, type = "reserved", onClose }) {
    const [selectedDays, setSelectedDays] = useState(car?.days || 7)

    if (!car) return null

    // Prepare images array for the carousel
    const carImages = car.images && car.images.length > 0 ? car.images : car.imageUrl ? [car.imageUrl] : []

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black text-white p-1 rounded-full z-10">
                        <X size={20} />
                    </button>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="h-64 rounded-lg overflow-hidden">
                                    <ImageCarousel images={carImages} className="h-full" />
                                </div>

                                {type === "rented" && (
                                    <div className="mt-4 p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold mb-2">Rental Status</h3>
                                        <div
                                            className={`flex items-center ${car.isDue ? "text-red-600" : car.isReturned ? "text-gray-600" : "text-green-600"}`}
                                        >
                                            {car.isReturned ? (
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                            ) : car.isDue ? (
                                                <AlertCircle className="mr-2 h-5 w-5" />
                                            ) : (
                                                <Calendar className="mr-2 h-5 w-5" />
                                            )}
                                            <span>
                                                {car.isReturned
                                                    ? `Returned on ${car.returnDate}`
                                                    : car.isDue
                                                        ? "Due already! Please return immediately"
                                                        : `Return before ${car.returnDate}`}
                                            </span>
                                        </div>
                                        {car.withPenalty && (
                                            <div className="mt-2 text-red-600 text-sm">Note: Late return penalty applied</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-2">{car.name}</h2>
                                <p className="text-gray-600 mb-4">{car.type}</p>

                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <span className="text-2xl font-bold">₱ {car.price}</span>
                                        <span className="text-gray-500 text-sm ml-1">per day</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                                        <Users size={20} className="mb-1" />
                                        <span className="text-sm">{car.seats} Seats</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                                        <Fuel size={20} className="mb-1" />
                                        <span className="text-sm">{car.fuelType}</span>
                                    </div>
                                </div>

                                {type === "reserved" && (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex items-center mb-2">
                                                <Clock size={18} className="mr-2" />
                                                <span className="font-medium">Rental Duration</span>
                                            </div>
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

                                        <div className="p-4 bg-gray-50 rounded-lg mb-6">
                                            <div className="flex justify-between mb-2">
                                                <span>Daily Rate</span>
                                                <span>₱ {car.price}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span>Duration</span>
                                                <span>{selectedDays} days</span>
                                            </div>
                                            <div className="flex justify-between font-bold">
                                                <span>Total</span>
                                                <span>₱ {car.price * selectedDays}.00</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={onClose}
                                                className="py-3 border border-black text-black rounded-lg hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button className="py-3 bg-black text-white rounded-lg hover:bg-gray-800">Proceed to Rent</button>
                                        </div>
                                    </>
                                )}

                                {type === "rented" && (
                                    <div className="p-4 bg-gray-50 rounded-lg mb-6">
                                        <h3 className="font-semibold mb-2">Rental Details</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Rental Start</span>
                                                <span>{car.startDate || "May 01, 2025"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Return Date</span>
                                                <span>{car.returnDate}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Daily Rate</span>
                                                <span>₱ {car.price}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Duration</span>
                                                <span>7 days</span>
                                            </div>
                                            <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>₱ {car.price * 7}.00</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {type === "rented" && !car.isReturned && (
                                    <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                                        Request Return
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Description</h3>
                            <p className="text-gray-600">
                                This {car.name} is a reliable and comfortable {car.type.toLowerCase()} perfect for both city driving and
                                longer trips. It features a smooth {car.transmission.toLowerCase()} transmission, efficient{" "}
                                {car.fuelType.toLowerCase()} engine, and spacious interior with {car.seats} seats. Well-maintained and
                                regularly serviced, this vehicle provides an excellent driving experience with modern amenities and
                                safety features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
