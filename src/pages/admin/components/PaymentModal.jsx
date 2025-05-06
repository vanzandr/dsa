"use client"

import { useState, useEffect } from "react"

export default function PaymentModal({ booking, onClose, onPaymentComplete }) {
    const [cashAmount, setCashAmount] = useState("")
    const [loading, setLoading] = useState(false)

    // Set default values
    useEffect(() => {
        if (booking) {
            setCashAmount(booking.totalAmount || booking.totalPrice || 4500)
        }
    }, [booking])

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        // Process payment - Cash only
        const paymentDetails = {
            method: "Cash",
            amount: booking?.totalAmount || booking?.totalPrice || 31500,
            status: "completed",
            timestamp: new Date().toISOString(),
        }

        // Notify parent component
        if (onPaymentComplete) {
            onPaymentComplete(paymentDetails)
        }

        setLoading(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Booking Summary</h2>

                    <div className="mb-6">
                        {booking?.carName && (
                            <div className="mb-4">
                                <h3 className="text-gray-600">Car Name</h3>
                                <p className="font-medium">{booking.carName}</p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-gray-600 italic">Amount Due</h3>
                            <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  ₱ {booking?.price || 4500} x{" "}
                    {booking?.days ||
                        Math.round((booking?.totalAmount || booking?.totalPrice || 31500) / (booking?.price || 4500))}{" "}
                    days
                </span>
                                <span className="font-bold">
                  ₱ {(booking?.totalAmount || booking?.totalPrice || 31500).toLocaleString()}
                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <input
                                    type="text"
                                    value="Cash"
                                    disabled
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                />
                                <p className="text-xs text-gray-500 mt-1">Only cash payments are accepted</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cash Amount</label>
                                <div className="flex items-center">
                                    <span className="mr-2">₱</span>
                                    <input
                                        type="text"
                                        value={cashAmount}
                                        onChange={(e) => setCashAmount(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Enter amount"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Processing...
                    </span>
                                    ) : (
                                        "Pay"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
