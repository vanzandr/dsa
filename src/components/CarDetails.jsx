"use client"

import { useState } from "react"
import { X, Users, Sliders, Fuel, Clock } from "lucide-react"
import ImageCarousel from "./ImageCarousel"

export default function CarDetails({ car, onClose }) {
    const [selectedDays, setSelectedDays] = useState(3)

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
                                        <Sliders size={20} className="mb-1" />
                                        <span className="text-sm">{car.transmission}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                                        <Fuel size={20} className="mb-1" />
                                        <span className="text-sm">{car.fuelType}</span>
                                    </div>
                                </div>

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

                                <button onClick={onClose} className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Description</h3>
                            <p className="text-gray-600">
                                {car.description ||
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
