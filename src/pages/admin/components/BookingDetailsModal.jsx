"use client"

import { useState } from "react"

export default function BookingDetailsModal({ booking, onClose }) {
    const [showIdImage, setShowIdImage] = useState(false)
    const [showContractImage, setShowContractImage] = useState(false)

    const handleViewId = () => {
        setShowIdImage(true)
    }

    const handleViewContract = () => {
        setShowContractImage(true)
    }

    const handleCloseImageModal = () => {
        setShowIdImage(false)
        setShowContractImage(false)
    }

    // Get status badge class based on booking status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Ongoing":
                return "bg-green-100 text-green-800"
            case "Overdue":
                return "bg-red-100 text-red-800"
            case "Confirmed":
                return "bg-blue-100 text-blue-800"
            case "Completed":
                return "bg-gray-100 text-gray-800"
            case "Cancelled":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    // Get payment status badge class
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

    // Get car details from booking
    const car = booking?.carDetails || {}

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Car Details */}
                    <div className="bg-gray-50 p-8">
                        <img
                            src="https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=2156"
                            alt="2016 Toyota Camry"
                            className="w-full h-auto rounded-lg mb-6"
                        />

                        <h2 className="text-2xl font-bold">2016 Toyota Camry</h2>
                        <p className="text-gray-600 mb-4">Sedan</p>

                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-2xl font-bold">₱ 4500</span>
                                <span className="text-gray-500 text-sm ml-1">per day</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                <span className="text-sm">4 Seats</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                <span className="text-sm">Automatic</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                                <span className="text-sm">Gasoline</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium mb-2">Plate Number</h3>
                                <p className="text-gray-700">DIWATA009</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Chassis Number</h3>
                                <p className="text-gray-700">{car?.chassisNumber || "N/A"}</p>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium mb-2">Start Date & Time</h3>
                                <p className="text-gray-700">{booking?.startDate || "01/24/2024 10:00 AM"}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">End Date & Time</h3>
                                <p className="text-gray-700">{booking?.endDate || "01/24/2024 10:00 AM"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="p-8">
                        <h2 className="text-xl font-bold mb-6">Booking Information</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Renter's Full Name</h3>
                                    <p className="text-gray-900">{booking?.customer || "Diwata Pares Overcook"}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Contact Number</h3>
                                    <p className="text-gray-900">63912-345-6789</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Driver's License ID number</h3>
                                    <p className="text-gray-900">1234 5678 9123</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Valid ID Image</h3>
                                    <button onClick={handleViewId} className="text-black hover:underline">
                                        validIDimage.jpeg
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Signed Contract Image</h3>
                                <button onClick={handleViewContract} className="text-black hover:underline">
                                    signedcontract.jpeg
                                </button>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">Booking Summary</h3>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Amount Due</span>
                                    <span>₱ 4500 x 7 days</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span>{booking?.paymentMethod || "Cash"}</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>{booking?.total || "₱ 31,500.00"}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Status</h3>
                                <span
                                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking?.status)}`}
                                >
                  {booking?.status || "Ongoing"}
                </span>
                                {booking?.actionRequired && (
                                    <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Action Required
                  </span>
                                )}
                            </div>

                            {booking?.paymentStatus && (
                                <div className="mt-2">
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Payment Status</h3>
                                    <span
                                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(booking.paymentStatus)}`}
                                    >
                    {booking.paymentStatus}
                  </span>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button onClick={onClose} className="px-4 py-2 bg-black text-white rounded-md">
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ID Image Modal */}
            {showIdImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
                    <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25-wj0YYO5fmGuDBEqDjzZS9t76A9WfzM.png"
                            alt="ID"
                            className="w-full h-auto"
                        />
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleCloseImageModal} className="px-4 py-2 bg-black text-white rounded-md">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contract Image Modal */}
            {showContractImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
                    <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25-wj0YYO5fmGuDBEqDjzZS9t76A9WfzM.png"
                            alt="Contract"
                            className="w-full h-auto"
                        />
                        <div className="mt-4 flex justify-end">
                            <button onClick={handleCloseImageModal} className="px-4 py-2 bg-black text-white rounded-md">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
