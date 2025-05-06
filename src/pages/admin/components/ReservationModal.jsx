"use client"

import { useState, useEffect } from "react"
import { useBookings } from "../../../context/BookingContext"
import { useCars } from "../../../context/CarContext"
import PaymentModal from "./PaymentModal"
import {useAuth} from "../../../context/AuthContext.jsx";
import { FileText } from "lucide-react"
import apiClient from "../../../services/apiClient.js";



export default function ReservationModal({ reservation, onClose }) {
    const { addBooking, getActiveBookings } = useBookings()
    const { getCarById } = useCars()
    const { currentUser } = useAuth()

    const customerId = parseInt(currentUser?.id?.replace(/\D/g, ""), 10) // ✅ FIXED

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        mobilePhone: "",
        nationality: "Filipino",
        licenseId: "",
        paymentMethod: "Cash",
    })

    const [documentFiles, setDocumentFiles] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [bookingData, setBookingData] = useState(null)
    const [car, setCar] = useState(null)
    const [validationError, setValidationError] = useState("")
    const [isValidating, setIsValidating] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!reservation) return

        const carData = getCarById(reservation.carId)
        if (carData) setCar(carData)

        setFormData({
            firstName: reservation.firstName || "",
            middleName: reservation.middleName || "",
            lastName: reservation.lastName || reservation.surname || "",
            mobilePhone: reservation.mobilePhone || reservation.contactNumber || "",
            nationality: reservation.nationality || "Filipino",
            licenseId: "",
            paymentMethod: "Cash",
        })
    }, [reservation])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const checkExistingLicense = () => {
        if (!formData.licenseId) {
            setValidationError("Driver's license ID is required")
            return false
        }

        setIsValidating(true)
        setValidationError("")

        try {
            const activeBookings = getActiveBookings()
            const exists = activeBookings.find(
                (b) => b.licenseId?.toLowerCase() === formData.licenseId.toLowerCase()
            )
            setIsValidating(false)

            if (exists) {
                setValidationError("This driver's license already has an active booking.")
                return false
            }

            return true
        } catch (error) {
            console.error("License check failed:", error)
            setValidationError("Error validating license.")
            setIsValidating(false)
            return false
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.licenseId) {
            setValidationError("Driver's license ID is required")
            return
        }

        if (!documentFiles) {
            setValidationError("Please upload required documents.")
            return
        }

        if (!checkExistingLicense()) return

        const booking = {
            carId: reservation.carId,
            carName: car?.name || reservation.car,
            customerName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
            mobilePhone: formData.mobilePhone,
            licenseId: formData.licenseId,
            nationality: formData.nationality,
            paymentMethod: "Cash",
            startDate: reservation.startDate,
            endDate: reservation.endDate,
            totalPrice: reservation.totalPrice || (car ? car.price * 7 : 0),
            status: "Ongoing",
        }

        setBookingData(booking)
        setShowPaymentModal(true)
    }

    const handlePaymentComplete = async () => {
        const completeBooking = {
            ...bookingData,
            paymentStatus: "Paid",
            paymentMethod: "Cash",
            paymentDate: new Date().toISOString(),
            startDateTime: new Date(bookingData.startDate).toISOString(),
            endDateTime: new Date(bookingData.endDate).toISOString(),
        }

        try {
            addBooking(completeBooking)
            await apiClient.post(`/api/customer/${customerId}/reservations`, completeBooking)

            alert("Booking created successfully!")
            window.location.href = "/admin/bookings"
            onClose()
        } catch (error) {
            console.error("Error creating booking:", error)
            alert("Failed to create booking: " + (error.response?.data?.message || error.message))
        }
    }

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false)
    }

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

                    {/* Booking Form */}
                    <div className="p-8">
                        <h2 className="text-xl font-bold mb-6">Booking Information</h2>

                        {validationError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{validationError}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                        <input
                                            type="text"
                                            name="middleName"
                                            value={formData.middleName}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lastname</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            type="text"
                                            name="mobilePhone"
                                            value={formData.mobilePhone}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver's License ID number</label>
                                        <input
                                            type="text"
                                            name="licenseId"
                                            value={formData.licenseId}
                                            onChange={handleChange}
                                            className={`w-full rounded-md border ${validationError && validationError.includes("license") ? "border-red-500" : "border-gray-300"} px-3 py-2`}
                                            required
                                        />
                                        {isValidating && <p className="mt-1 text-sm text-blue-600">Validating license...</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Required Documents</label>
                                        <div className="space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById("documentsUpload").click()}
                                                className={`w-full rounded-md border ${!documentFiles && validationError && validationError.includes("documents") ? "border-red-500" : "border-gray-300"} px-3 py-2 bg-white text-gray-700`}
                                            >
                                                {documentFiles ? `${documentFiles.length} file(s) selected` : "Upload Documents"}
                                            </button>
                                            <input
                                                id="documentsUpload"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setDocumentFiles(e.target.files)}
                                                multiple
                                                required
                                            />
                                            <div className="text-xs text-gray-500">
                                                <div className="flex items-center mb-1">
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    <span>Driver's License</span>
                                                </div>
                                                <div className="flex items-center mb-1">
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    <span>Signed Contract</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <FileText className="h-3 w-3 mr-1" />
                                                    <span>Booking Proof</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-medium mb-2">Booking Summary</h3>
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

                                <div className="flex justify-end space-x-4">
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
                                        className="px-4 py-2 bg-black text-white rounded-md"
                                        disabled={loading || isValidating}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Processing...
                      </span>
                                        ) : (
                                            "Proceed"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    booking={{
                        carName: car.name,
                        price: car.price,
                        days: Math.round(reservation.totalPrice / car.price),
                        totalAmount: reservation.totalPrice,
                    }}
                    onClose={handleClosePaymentModal}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}
        </div>
    )
}
