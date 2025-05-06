"use client"

import { useState, useEffect } from "react"
import { X, Check, AlertCircle, Clock, Upload } from "lucide-react"


export default function ReturnCarModal({ booking, onClose, onComplete }) {
    const [damageDetails, setDamageDetails] = useState({
        hasDamage: false,
        description: "",
        additionalFee: 0,
        isPaid: false,
        paymentMethod: "Cash", // Default to Cash
    })

    const [overduePayment, setOverduePayment] = useState({
        isPaid: false,
        paymentMethod: "Cash", // Default to Cash
    })

    const [overdueDetails, setOverdueDetails] = useState({
        isOverdue: false,
        hours: 0,
        fee: 0,
    })

    const [damageFile, setDamageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [showDamagePayment, setShowDamagePayment] = useState(false)
    const [showOverduePayment, setShowOverduePayment] = useState(false)
    const [totalFees, setTotalFees] = useState({
        damage: 0,
        overdue: 0,
        total: 0,
    })

    // Calculate overdue hours and fee when the component mounts
    useEffect(() => {
        if (booking && booking.endDate) {
            const endDate = new Date(booking.endDate)
            const now = new Date()

            // Check if the booking is overdue
            if ((now > endDate && booking.status === "Ongoing") || booking.status === "Overdue") {
                // Calculate hours difference
                const diffMs = now - endDate
                const overdueHours = Math.ceil(diffMs / (1000 * 60 * 60)) // Convert ms to hours and round up
                const overdueFee = overdueHours * 300 // 300 per hour

                setOverdueDetails({
                    isOverdue: true,
                    hours: overdueHours,
                    fee: overdueFee,
                })
            }
        }
    }, [booking])

    // Calculate total fees when damage fee or overdue fee changes
    useEffect(() => {
        setTotalFees({
            damage: damageDetails.additionalFee,
            overdue: overdueDetails.fee,
            total: damageDetails.additionalFee + overdueDetails.fee,
        })
    }, [damageDetails.additionalFee, overdueDetails.fee])

    const handleDamageChange = (e) => {
        const { name, value, type, checked } = e.target
        setDamageDetails((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDamageFile(e.target.files[0])
        }
    }

    const handleAdditionalFeeChange = (e) => {
        const value = Number.parseFloat(e.target.value) || 0
        setDamageDetails((prev) => ({
            ...prev,
            additionalFee: value,
        }))
    }

    const handleDamagePaymentToggle = () => {
        setShowDamagePayment(!showDamagePayment)
        if (!showDamagePayment) {
            setDamageDetails((prev) => ({
                ...prev,
                isPaid: false,
            }))
        }
    }

    const handleOverduePaymentToggle = () => {
        setShowOverduePayment(!showOverduePayment)
        if (!showOverduePayment) {
            setOverduePayment((prev) => ({
                ...prev,
                isPaid: false,
            }))
        }
    }

    const handleDamagePaymentSubmit = () => {
        setDamageDetails((prev) => ({
            ...prev,
            isPaid: true,
        }))
        setShowDamagePayment(false)
    }

    const handleOverduePaymentSubmit = () => {
        setOverduePayment((prev) => ({
            ...prev,
            isPaid: true,
        }))
        setShowOverduePayment(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            // Check if damage file is required but not provided
            if (damageDetails.hasDamage && !damageFile) {
                setError("Please upload damage documentation")
                setLoading(false)
                return
            }

            // Check if overdue payment is required but not collected
            if (overdueDetails.isOverdue && !overduePayment.isPaid) {
                setError("Please collect overdue payment before completing the return")
                setLoading(false)
                return
            }

            // Prepare the return data
            const returnData = {
                bookingId: booking.id,
                returnDate: new Date().toISOString(),
                damageAssessment: {
                    hasDamage: damageDetails.hasDamage,
                    description: damageDetails.description,
                    additionalFee: damageDetails.additionalFee,
                    isPaid: damageDetails.isPaid,
                    paymentMethod: "Cash", // Always Cash
                    paymentDate: damageDetails.isPaid ? new Date().toISOString() : null,
                    hasDocumentation: !!damageFile,
                },
                status: "Completed",
                overdueFee: overdueDetails.fee,
                overdueHours: overdueDetails.hours,
                overduePayment: {
                    isPaid: overduePayment.isPaid,
                    paymentMethod: "Cash",
                    paymentDate: overduePayment.isPaid ? new Date().toISOString() : null,
                },
            }

            // Call the parent handler
            if (onComplete) {
                await onComplete(returnData)
            }

            setSuccess("Car returned successfully!")

            // Close modal after a delay
            setTimeout(() => {
                onClose()
            }, 2000)
        } catch (error) {
            console.error("Error processing car return:", error)
            setError("Failed to process car return. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Return Car</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
                            <Check className="h-5 w-5 mr-2" />
                            {success}
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Car Details</h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                            <div>
                                <p className="text-sm text-gray-500">Car</p>
                                <p className="font-medium">{booking?.car || booking?.carName || "Unknown Car"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Chassis Number</p>
                                <p className="font-medium">{booking?.carDetails?.chassisNumber || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Plate Number</p>
                                <p className="font-medium">{booking?.carDetails?.plateNumber || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Return Date</p>
                                <p className="font-medium">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Booking End Date</p>
                                <p className="font-medium">{new Date(booking?.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className={`font-medium ${overdueDetails.isOverdue ? "text-red-600" : "text-green-600"}`}>
                                    {overdueDetails.isOverdue ? "Overdue" : "On Time"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Overdue Section */}
                        {overdueDetails.isOverdue && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2 flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-red-600" />
                                    Overdue Charges
                                </h3>
                                <div className="bg-red-50 p-4 rounded-md border border-red-200">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">Overdue Hours</span>
                                        <span className="font-medium">{overdueDetails.hours} hours</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">Rate per Hour</span>
                                        <span className="font-medium">₱ 300.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold mb-3">
                                        <span className="text-red-700">Overdue Fee</span>
                                        <span className="text-red-700">₱ {overdueDetails.fee.toLocaleString()}</span>
                                    </div>

                                    {/* Overdue Payment Collection */}
                                    {!overduePayment.isPaid ? (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={handleOverduePaymentToggle}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                                            >
                                                Collect Overdue Payment
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
                                            <Check className="h-5 w-5 mr-2" />
                                            Overdue payment collected: ₱{overdueDetails.fee.toLocaleString()} (Cash)
                                        </div>
                                    )}

                                    {showOverduePayment && (
                                        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
                                            <h4 className="font-medium mb-2">Overdue Payment Details</h4>
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                                <input
                                                    type="text"
                                                    value="Cash"
                                                    disabled
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Only cash payments are accepted</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                                <div className="flex items-center">
                                                    <span className="mr-2">₱</span>
                                                    <input
                                                        type="text"
                                                        value={overdueDetails.fee}
                                                        disabled
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleOverduePaymentSubmit}
                                                    className="px-4 py-2 bg-black text-white rounded-md"
                                                >
                                                    Confirm Payment
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">Damage Assessment</h3>

                            <div className="mb-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hasDamage"
                                        checked={damageDetails.hasDamage}
                                        onChange={handleDamageChange}
                                        className="rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <span>Car has damage</span>
                                </label>
                            </div>

                            {damageDetails.hasDamage && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Damage Documentation</label>
                                        <div className="flex items-center">
                                            <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 px-4 py-6 rounded-md cursor-pointer hover:bg-gray-50">
                                                <div className="space-y-1 text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                            <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              Upload damage photos
                            </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                                <input
                                                    id="damage-file-upload"
                                                    name="damage-file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        {damageFile && <p className="mt-2 text-sm text-green-600">File selected: {damageFile.name}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={damageDetails.description}
                                            onChange={handleDamageChange}
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            placeholder="Describe the damage in detail..."
                                        ></textarea>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Damage Fee (₱)</label>
                                        <input
                                            type="number"
                                            name="additionalFee"
                                            value={damageDetails.additionalFee}
                                            onChange={handleAdditionalFeeChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            min="0"
                                            step="100"
                                            placeholder="Enter damage fee amount"
                                        />
                                    </div>

                                    {damageDetails.additionalFee > 0 && (
                                        <div className="mb-4">
                                            {!damageDetails.isPaid ? (
                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={handleDamagePaymentToggle}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                                                    >
                                                        Collect Damage Payment
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center">
                                                    <Check className="h-5 w-5 mr-2" />
                                                    Damage payment collected: ₱{damageDetails.additionalFee.toLocaleString()} (Cash)
                                                </div>
                                            )}

                                            {showDamagePayment && (
                                                <div className="mt-4 p-4 border border-gray-200 rounded-md">
                                                    <h4 className="font-medium mb-2">Damage Payment Details</h4>
                                                    <div className="mb-3">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                                        <input
                                                            type="text"
                                                            value="Cash"
                                                            disabled
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">Only cash payments are accepted</p>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                                        <div className="flex items-center">
                                                            <span className="mr-2">₱</span>
                                                            <input
                                                                type="text"
                                                                value={damageDetails.additionalFee}
                                                                disabled
                                                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={handleDamagePaymentSubmit}
                                                            className="px-4 py-2 bg-black text-white rounded-md"
                                                        >
                                                            Confirm Payment
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Total Fees Summary - Always show this section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Total Fees Summary</h3>
                            <div className="bg-gray-50 p-4 rounded-md">
                                {damageDetails.hasDamage && damageDetails.additionalFee > 0 && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-700">Damage Fee</span>
                                        <span className="font-medium">₱ {damageDetails.additionalFee.toLocaleString()}</span>
                                    </div>
                                )}
                                {overdueDetails.isOverdue && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-700">Overdue Fee ({overdueDetails.hours} hours)</span>
                                        <span className="font-medium">₱ {overdueDetails.fee.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between font-bold">
                                    <span>Total Additional Fees</span>
                                    <span>₱ {totalFees.total.toLocaleString()}</span>
                                </div>

                                {/* Payment Status Summary */}
                                {totalFees.total > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <h4 className="font-medium text-sm mb-2">Payment Status</h4>
                                        {damageDetails.hasDamage && damageDetails.additionalFee > 0 && (
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Damage Fee:</span>
                                                <span className={damageDetails.isPaid ? "text-green-600" : "text-red-600"}>
                          {damageDetails.isPaid ? "Paid" : "Unpaid"}
                        </span>
                                            </div>
                                        )}
                                        {overdueDetails.isOverdue && (
                                            <div className="flex justify-between text-sm">
                                                <span>Overdue Fee:</span>
                                                <span className={overduePayment.isPaid ? "text-green-600" : "text-red-600"}>
                          {overduePayment.isPaid ? "Paid" : "Unpaid"}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-4 flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-md flex items-center"
                                disabled={
                                    loading ||
                                    (damageDetails.hasDamage && damageDetails.additionalFee > 0 && !damageDetails.isPaid) ||
                                    (overdueDetails.isOverdue && !overduePayment.isPaid) ||
                                    (damageDetails.hasDamage && !damageFile)
                                }
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                        Processing...
                                    </>
                                ) : (
                                    "Complete Return"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

