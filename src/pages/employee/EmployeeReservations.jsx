import { useState, useEffect } from "react"
import { Search, AlertCircle, CheckCircle } from "lucide-react"
import EmployeeSidebar from "./components/EmployeeSidebar.jsx"
import ReservationModal from "./components/ReservationModal"
import { useReservations } from "../../context/ReservationContext"
import { useCars } from "../../context/CarContext"
import PaymentModal from "../admin/components/PaymentModal.jsx";


export default function EmployeeReservations() {
  const { reservations, updateReservation } = useReservations()
  const { cars, getCarById } = useCars()

  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState(null)
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    if (reservations.length > 0 && cars.length > 0) {
      const processedReservations = reservations.map((reservation) => {
        const car = getCarById(reservation.carId)
        return {
          ...reservation,
          car: car ? car.name : "Unknown Car",
          customer: reservation.customerName || "Unknown Customer",
        }
      })

      // Sort by creation date, newest first
      processedReservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setFilteredReservations(processedReservations)
      setLoading(false)
    }
  }, [reservations, cars])

  // Filter reservations based on selected filter and search term
  useEffect(() => {
    if (loading) return

    let result = [...reservations].map((reservation) => {
      const car = getCarById(reservation.carId)
      return {
        ...reservation,
        car: car ? car.name : "Unknown Car",
        customer: reservation.customerName || "Unknown Customer",
      }
    })

    // Sort by creation date, newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Apply filter
    if (filter !== "all") {
      if (filter === "active") result = result.filter((r) => r.status === "Active")
      if (filter === "pending") result = result.filter((r) => r.status === "Waiting for Approval")
      if (filter === "cancelled") result = result.filter((r) => r.status === "Cancelled")
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.car.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredReservations(result)
  }, [filter, searchTerm, loading])

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation)
    setShowReservationModal(true)
  }

  const handleCloseReservationModal = () => {
    setShowReservationModal(false)
    setSelectedReservation(null)
  }

  const handleDirectPayment = (reservation) => {
    setSelectedReservation(reservation)
    setShowPaymentModal(true)
  }

  const handlePaymentComplete = (paymentDetails) => {
    if (!selectedReservation) return

    // Update reservation status
    const updatedReservation = {
      ...selectedReservation,
      status: "Converted to Booking",
      paymentStatus: "Paid",
      paymentMethod: paymentDetails.method,
      paymentDate: new Date().toISOString(),
    }
    updateReservation(updatedReservation)

    // Update UI
    setFilteredReservations((prev) =>
      prev.map((r) => (r.id === selectedReservation.id ? { ...r, status: "Converted to Booking" } : r)),
    )

    // Show success message
    setStatusMessage({
      type: "success",
      message: "Payment processed successfully",
    })

    // Clear message after 3 seconds
    setTimeout(() => {
      setStatusMessage({ type: "", message: "" })
    }, 3000)

    setShowPaymentModal(false)
    setSelectedReservation(null)
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
  }

  // Function to determine the status badge style
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Waiting for Approval":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-gray-100 text-gray-800"
      case "Converted to Booking":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <EmployeeSidebar active="reservations" />
        <div className="flex-1 p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EmployeeSidebar active="reservations" />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-gray-600">View car reservations</p>
        </div>

        {/* Status Message */}
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

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search name or ID"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-md ${filter === "active" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-md ${filter === "pending" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 rounded-md ${filter === "cancelled" ? "bg-black text-white" : "bg-white text-gray-700 border"}`}
            >
              Cancelled
            </button>
          </div>
        </div>
        {/* Reservations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredReservations.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservation Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservation.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reservation.car}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(reservation.status)}`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewDetails(reservation)} className="text-black hover:underline">
                          View Details
                        </button>
                        {reservation.status === "Active" && (
                          <button
                            onClick={() => handleDirectPayment(reservation)}
                            className="text-blue-600 hover:underline"
                          >
                            Process Payment
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && selectedReservation && (
        <ReservationModal reservation={selectedReservation} onClose={handleCloseReservationModal} readOnly={true} />
      )}

      {showPaymentModal && selectedReservation && (
        <PaymentModal
          booking={{
            carName: selectedReservation.car,
            price: selectedReservation.totalPrice / 7, // Estimate daily price
            days: 7,
            totalAmount: selectedReservation.totalPrice,
          }}
          onClose={handleClosePaymentModal}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}
